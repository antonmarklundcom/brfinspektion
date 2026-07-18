import { describe, expect, it, beforeAll, afterAll } from "vitest";

// Integration test — requires a real Postgres (same pattern as
// tests/followups.test.ts / tests/crm-loop.test.ts).
const hasDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDb)("lib/users.ts (admin/installningar create-user form)", () => {
  let prisma: import("@prisma/client").PrismaClient;
  let createUser: typeof import("@/lib/users").createUser;
  let setUserActive: typeof import("@/lib/users").setUserActive;

  beforeAll(async () => {
    const { PrismaClient } = await import("@prisma/client");
    prisma = new PrismaClient();
    ({ createUser, setUserActive } = await import("@/lib/users"));
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const owner = { role: "OWNER" as const, partnerId: null };

  it("rejects a PARTNER-role user with no partnerId", async () => {
    await expect(
      createUser(owner, {
        name: "Test",
        email: `test-${Date.now()}@example.com`,
        password: "password123",
        role: "PARTNER",
      }),
    ).rejects.toThrow("must be assigned to a partner");
  });

  it("rejects an OWNER-role user with a partnerId", async () => {
    const partner = await prisma.partner.create({ data: { name: `Partner ${Date.now()}` } });
    await expect(
      createUser(owner, {
        name: "Test",
        email: `test-${Date.now()}@example.com`,
        password: "password123",
        role: "OWNER",
        partnerId: partner.id,
      }),
    ).rejects.toThrow("must not be assigned to a partner");
    await prisma.partner.delete({ where: { id: partner.id } });
  });

  it("creates a PARTNER user tied to a partner, with a hashed password", async () => {
    const partner = await prisma.partner.create({ data: { name: `Partner ${Date.now()}` } });
    const email = `partner-user-${Date.now()}@example.com`;
    const user = await createUser(owner, {
      name: "Partner Person",
      email,
      password: "password123",
      role: "PARTNER",
      partnerId: partner.id,
    });

    expect(user.role).toBe("PARTNER");
    expect(user.partnerId).toBe(partner.id);
    expect(user.passwordHash).not.toBe("password123");
    expect(user.active).toBe(true);

    await prisma.user.delete({ where: { id: user.id } });
    await prisma.partner.delete({ where: { id: partner.id } });
  });

  it("a non-OWNER session cannot create users", async () => {
    await expect(
      createUser(
        { role: "PARTNER", partnerId: "some-partner" },
        { name: "X", email: "x@example.com", password: "password123", role: "PARTNER" },
      ),
    ).rejects.toThrow();
  });

  it("refuses to let the Owner deactivate their own account", async () => {
    const ownerWithId = { role: "OWNER" as const, partnerId: null, id: "self-id" };
    await expect(setUserActive(ownerWithId, "self-id", false)).rejects.toThrow(
      "cannot deactivate your own account",
    );
  });

  it("lets the Owner deactivate a different user", async () => {
    const partner = await prisma.partner.create({ data: { name: `Partner ${Date.now()}` } });
    const user = await createUser(owner, {
      name: "Deactivate Me",
      email: `deactivate-${Date.now()}@example.com`,
      password: "password123",
      role: "PARTNER",
      partnerId: partner.id,
    });

    const ownerWithId = { role: "OWNER" as const, partnerId: null, id: "owner-id" };
    const updated = await setUserActive(ownerWithId, user.id, false);
    expect(updated.active).toBe(false);

    await prisma.user.delete({ where: { id: user.id } });
    await prisma.partner.delete({ where: { id: partner.id } });
  });
});
