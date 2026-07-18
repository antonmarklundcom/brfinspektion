import { prisma } from "@/lib/prisma";
import { AccessSession, assertOwner, leadWhereForSession } from "@/lib/access";
import { LeadStatus, Role } from "@prisma/client";
import { sendEmail } from "@/lib/email";

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

/**
 * OWNER-only: deciding which partner a lead belongs to is a triage
 * decision, not something a partner should be able to grant themselves
 * (that would let a PARTNER session assign leads to their own partnerId
 * and gain visibility into records they weren't given).
 */
export async function assignLeadToPartner(
  session: AccessSession,
  id: string,
  partnerId: string | null,
) {
  assertOwner(session);
  const lead = await getLeadForSession(session, id);
  if (!lead) return null;

  const updated = await prisma.lead.update({
    where: { id },
    data: { assignedPartnerId: partnerId },
  });

  // architecture.md §6.1: "Lead assigned to partner -> that partner's
  // user emails -> Lead summary (no other-partner data) + admin link."
  // Only fires on an actual assignment, not on unassigning (partnerId null).
  if (partnerId) {
    const partnerUsers = await prisma.user.findMany({
      where: { partnerId, role: Role.PARTNER, active: true },
    });
    if (partnerUsers.length > 0) {
      await sendEmail({
        to: partnerUsers.map((user) => user.email),
        subject: `Ny lead tilldelad: ${updated.brfNamn}`,
        html: `<p>En lead har tilldelats er.</p>
          <p>Förening: ${updated.brfNamn}</p>
          <p>Kontakt: ${updated.kontaktNamn}, ${updated.epost}${updated.telefon ? `, ${updated.telefon}` : ""}</p>
          <p><a href="https://brfinspektion.se/admin/leads/${updated.id}">Öppna i admin</a></p>`,
      });
    }
  }

  return updated;
}
