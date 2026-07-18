import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { AccessSession, assertOwner } from "@/lib/access";
import { Role } from "@prisma/client";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: Role;
  partnerId?: string | null;
}

/**
 * OWNER-only (architecture.md §5): only the Owner creates logins. A
 * PARTNER-role user must be tied to a Partner record — that's what makes
 * the partner-scoped queries in lib/access.ts actually resolve to
 * something. An OWNER-role user must NOT have a partnerId (they see
 * everything; scoping doesn't apply to them).
 */
export async function createUser(session: AccessSession, input: CreateUserInput) {
  assertOwner(session);

  if (input.role === Role.PARTNER && !input.partnerId) {
    throw new Error("A PARTNER user must be assigned to a partner");
  }
  if (input.role === Role.OWNER && input.partnerId) {
    throw new Error("An OWNER user must not be assigned to a partner");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
      partnerId: input.role === Role.PARTNER ? input.partnerId : null,
      active: true,
    },
  });
}

/**
 * OWNER-only. Refuses to let the Owner deactivate their own account —
 * that would lock the only administrator out with no recovery path
 * short of a direct database edit.
 */
export async function setUserActive(
  session: AccessSession & { id: string },
  userId: string,
  active: boolean,
) {
  assertOwner(session);
  if (userId === session.id && !active) {
    throw new Error("You cannot deactivate your own account");
  }
  return prisma.user.update({ where: { id: userId }, data: { active } });
}
