import { Prisma } from "@prisma/client";

// Partner-scoped access control (architecture.md §5). This is the ONLY
// place where "which records can this session see" is decided. UI hiding
// alone is never sufficient — every admin repository function in lib/
// must route through here before querying Prisma.

export interface AccessSession {
  role: "OWNER" | "PARTNER";
  partnerId: string | null;
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/**
 * Returns a Prisma `where` fragment restricting a lead/project/task query to
 * what the session is allowed to see. OWNER sees everything (empty filter).
 * PARTNER sees only records assigned to their own partnerId.
 */
export function leadWhereForSession(session: AccessSession): Prisma.LeadWhereInput {
  if (session.role === "OWNER") return {};
  if (!session.partnerId) return { id: "__no_match__" };
  return { assignedPartnerId: session.partnerId };
}

export function projectWhereForSession(session: AccessSession): Prisma.ProjectWhereInput {
  if (session.role === "OWNER") return {};
  if (!session.partnerId) return { id: "__no_match__" };
  return { partnerId: session.partnerId };
}

export function followUpTaskWhereForSession(
  session: AccessSession,
): Prisma.FollowUpTaskWhereInput {
  if (session.role === "OWNER") return {};
  if (!session.partnerId) return { id: "__no_match__" };
  return { partnerId: session.partnerId };
}

/** Fields a PARTNER session must never receive, even for records they can see. */
export const OWNER_ONLY_PROJECT_FIELDS = ["contractValueSek"] as const;

export function stripOwnerOnlyFields<T extends Record<string, unknown>>(
  session: AccessSession,
  record: T,
): T {
  if (session.role === "OWNER") return record;
  const clone = { ...record };
  for (const field of OWNER_ONLY_PROJECT_FIELDS) {
    if (field in clone) delete (clone as Record<string, unknown>)[field];
  }
  return clone;
}

export function assertOwner(session: AccessSession): void {
  if (session.role !== "OWNER") {
    throw new ForbiddenError("Only OWNER may perform this action");
  }
}
