import { describe, expect, it, beforeAll, afterAll } from "vitest";

// Integration test for the lead -> customer -> project -> completed ->
// follow-up tasks loop (plan.md "next step": the CRM pipeline that makes
// the follow-up automation engine reachable from the UI). Requires a real
// Postgres via DATABASE_URL, same as tests/followups.test.ts.
const hasDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDb)("CRM loop (lib/customers.ts, lib/projects.ts)", () => {
  let prisma: import("@prisma/client").PrismaClient;
  let convertLeadToCustomer: typeof import("@/lib/customers").convertLeadToCustomer;
  let markProjectCompleted: typeof import("@/lib/projects").markProjectCompleted;
  let createProject: typeof import("@/lib/projects").createProject;
  let getProjectForSession: typeof import("@/lib/projects").getProjectForSession;
  let setProjectContractValue: typeof import("@/lib/projects").setProjectContractValue;
  let assignLeadToPartner: typeof import("@/lib/leads").assignLeadToPartner;

  beforeAll(async () => {
    const { PrismaClient } = await import("@prisma/client");
    prisma = new PrismaClient();
    ({ convertLeadToCustomer } = await import("@/lib/customers"));
    ({ markProjectCompleted, createProject, getProjectForSession, setProjectContractValue } =
      await import("@/lib/projects"));
    ({ assignLeadToPartner } = await import("@/lib/leads"));
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("converts a lead to a customer+project and generates follow-up tasks on completion", async () => {
    const partner = await prisma.partner.create({ data: { name: `Test Partner ${Date.now()}` } });
    const lead = await prisma.lead.create({
      data: {
        type: "CONTACT",
        sourcePath: "/kontakt",
        kontaktNamn: "Test Kontakt",
        epost: "test@example.com",
        brfNamn: "Brf CRM-loop",
        consentAt: new Date(),
      },
    });

    const owner = { role: "OWNER" as const, partnerId: null };

    const { customer, project } = (await convertLeadToCustomer(
      owner,
      lead.id,
      { serviceType: "KONTROLLANSVARIG", partnerId: partner.id },
      null,
    ))!;

    expect(customer.brfNamn).toBe("Brf CRM-loop");
    expect(project.serviceType).toBe("KONTROLLANSVARIG");
    expect(project.partnerId).toBe(partner.id);

    const updatedLead = await prisma.lead.findUniqueOrThrow({ where: { id: lead.id } });
    expect(updatedLead.status).toBe("WON");
    expect(updatedLead.customerId).toBe(customer.id);

    await markProjectCompleted(owner, project.id, new Date("2026-01-01"));

    const tasks = await prisma.followUpTask.findMany({ where: { projectId: project.id } });
    expect(tasks).toHaveLength(2);
    expect(tasks.map((t) => t.type).sort()).toEqual(["GARANTI_2AR", "GARANTI_5AR"]);

    // cleanup
    await prisma.followUpTask.deleteMany({ where: { projectId: project.id } });
    await prisma.project.delete({ where: { id: project.id } });
    await prisma.statusEvent.deleteMany({ where: { leadId: lead.id } });
    await prisma.lead.delete({ where: { id: lead.id } });
    await prisma.customer.delete({ where: { id: customer.id } });
    await prisma.partner.delete({ where: { id: partner.id } });
  });

  it("a PARTNER session cannot complete a project assigned to a different partner", async () => {
    const partnerA = await prisma.partner.create({ data: { name: `Partner A ${Date.now()}` } });
    const partnerB = await prisma.partner.create({ data: { name: `Partner B ${Date.now()}` } });
    const customer = await prisma.customer.create({ data: { brfNamn: "Brf Scoping Test" } });
    const project = await prisma.project.create({
      data: { customerId: customer.id, serviceType: "OVK", partnerId: partnerA.id },
    });

    const sessionForB = { role: "PARTNER" as const, partnerId: partnerB.id };

    const fetched = await getProjectForSession(sessionForB, project.id);
    expect(fetched).toBeNull();

    const result = await markProjectCompleted(sessionForB, project.id, new Date());
    expect(result).toBeNull();

    const unchanged = await prisma.project.findUniqueOrThrow({ where: { id: project.id } });
    expect(unchanged.status).toBe("PLANERAD");

    await prisma.project.delete({ where: { id: project.id } });
    await prisma.customer.delete({ where: { id: customer.id } });
    await prisma.partner.delete({ where: { id: partnerA.id } });
    await prisma.partner.delete({ where: { id: partnerB.id } });
  });

  it("createProject rejects a PARTNER session", async () => {
    const customer = await prisma.customer.create({ data: { brfNamn: "Brf Reject Test" } });
    const sessionForPartner = { role: "PARTNER" as const, partnerId: "some-partner" };

    await expect(
      createProject(sessionForPartner, { customerId: customer.id, serviceType: "OVK" }),
    ).rejects.toThrow();

    await prisma.customer.delete({ where: { id: customer.id } });
  });

  it("sets and updates contractValueSek, OWNER-only, hidden from PARTNER-visible payloads", async () => {
    const customer = await prisma.customer.create({ data: { brfNamn: "Brf Contract Test" } });
    const owner = { role: "OWNER" as const, partnerId: null };

    const project = await createProject(owner, {
      customerId: customer.id,
      serviceType: "KONTROLLANSVARIG",
      contractValueSek: 250_000,
    });
    expect(project.contractValueSek).toBe(250_000);

    const updated = await setProjectContractValue(owner, project.id, 300_000);
    expect(updated.contractValueSek).toBe(300_000);

    const sessionForPartner = { role: "PARTNER" as const, partnerId: "some-partner" };
    await expect(setProjectContractValue(sessionForPartner, project.id, 999)).rejects.toThrow();

    await prisma.project.delete({ where: { id: project.id } });
    await prisma.customer.delete({ where: { id: customer.id } });
  });

  it("assignLeadToPartner sets assignedPartnerId and does not throw when partner has no users yet", async () => {
    const partner = await prisma.partner.create({ data: { name: `Assign Test ${Date.now()}` } });
    const lead = await prisma.lead.create({
      data: {
        type: "CONTACT",
        sourcePath: "/kontakt",
        kontaktNamn: "Test",
        epost: "assign-test@example.com",
        brfNamn: "Brf Assign Test",
        consentAt: new Date(),
      },
    });

    const owner = { role: "OWNER" as const, partnerId: null };
    const updated = await assignLeadToPartner(owner, lead.id, partner.id);
    expect(updated?.assignedPartnerId).toBe(partner.id);

    const sessionForPartner = { role: "PARTNER" as const, partnerId: partner.id };
    await expect(assignLeadToPartner(sessionForPartner, lead.id, partner.id)).rejects.toThrow();

    await prisma.lead.delete({ where: { id: lead.id } });
    await prisma.partner.delete({ where: { id: partner.id } });
  });
});
