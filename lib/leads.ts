import { prisma } from "@/lib/prisma";
import { AccessSession, leadWhereForSession } from "@/lib/access";
import { LeadStatus } from "@prisma/client";

export async function listLeadsForSession(session: AccessSession) {
  return prisma.lead.findMany({
    where: leadWhereForSession(session),
    orderBy: { createdAt: "desc" },
  });
}

export async function getLeadForSession(session: AccessSession, id: string) {
  return prisma.lead.findFirst({
    where: { id, ...leadWhereForSession(session) },
  });
}

export async function setLeadStatus(
  session: AccessSession,
  id: string,
  to: LeadStatus,
  byUserId: string | null,
) {
  const lead = await getLeadForSession(session, id);
  if (!lead) return null;

  return prisma.$transaction(async (tx) => {
    const updated = await tx.lead.update({ where: { id }, data: { status: to } });
    await tx.statusEvent.create({
      data: { leadId: id, from: lead.status, to, byUserId },
    });
    return updated;
  });
}
