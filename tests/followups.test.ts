import { describe, expect, it, beforeAll, afterAll } from "vitest";

// Integration test — requires a real Postgres reachable via DATABASE_URL
// (architecture.md §9 test #3). Skipped automatically when no DATABASE_URL
// is configured (e.g. running `npm test` locally without a dev database).
// CI must set DATABASE_URL against a disposable test database for this
// suite to actually run.
const hasDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDb)("generateFollowUpTasksForProject (architecture.md §4.6)", () => {
  let prisma: import("@prisma/client").PrismaClient;
  let generateFollowUpTasksForProject: typeof import("@/lib/followups").generateFollowUpTasksForProject;

  beforeAll(async () => {
    const { PrismaClient } = await import("@prisma/client");
    prisma = new PrismaClient();
    ({ generateFollowUpTasksForProject } = await import("@/lib/followups"));
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates GARANTI_2AR (+21mo) and GARANTI_5AR (+57mo) tasks for a completed KA project, and is idempotent", async () => {
    const customer = await prisma.customer.create({ data: { brfNamn: "Test BRF" } });
    const completedDate = new Date("2026-01-01");
    const project = await prisma.project.create({
      data: {
        customerId: customer.id,
        serviceType: "KONTROLLANSVARIG",
        status: "SLUTFORD",
        completedDate,
      },
    });

    await generateFollowUpTasksForProject(project.id);
    await generateFollowUpTasksForProject(project.id); // idempotency check

    const tasks = await prisma.followUpTask.findMany({ where: { projectId: project.id } });
    expect(tasks).toHaveLength(2);

    const twoYear = tasks.find((t) => t.type === "GARANTI_2AR");
    const fiveYear = tasks.find((t) => t.type === "GARANTI_5AR");
    expect(twoYear?.dueDate.toISOString().slice(0, 7)).toBe("2027-10");
    expect(fiveYear?.dueDate.toISOString().slice(0, 7)).toBe("2030-10");

    await prisma.followUpTask.deleteMany({ where: { projectId: project.id } });
    await prisma.project.delete({ where: { id: project.id } });
    await prisma.customer.delete({ where: { id: customer.id } });
  });

  it("flags an OVK task instead of guessing when ovkIntervalYears is unset", async () => {
    const customer = await prisma.customer.create({ data: { brfNamn: "Test BRF OVK" } });
    const project = await prisma.project.create({
      data: {
        customerId: customer.id,
        serviceType: "OVK",
        status: "SLUTFORD",
        completedDate: new Date("2026-01-01"),
      },
    });

    await generateFollowUpTasksForProject(project.id);

    const task = await prisma.followUpTask.findFirst({ where: { projectId: project.id } });
    expect(task?.title).toContain("intervall ej satt");

    await prisma.followUpTask.deleteMany({ where: { projectId: project.id } });
    await prisma.project.delete({ where: { id: project.id } });
    await prisma.customer.delete({ where: { id: customer.id } });
  });
});
