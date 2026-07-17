import { prisma } from "@/lib/prisma";
import { AccessSession, assertOwner } from "@/lib/access";
import { LeadStatus, ServiceType } from "@prisma/client";
import { getLeadForSession } from "@/lib/leads";

export interface ConvertLeadInput {
  serviceType: ServiceType;
  partnerId?: string | null;
}

/**
 * Converts a WON lead into a Customer + Project (architecture.md §2:
 * "convert-to-customer flow"). Restricted to OWNER — converting a lead
 * commits the business to a customer relationship and is not a per-record
 * status update a partner should be able to trigger on their own.
 * Idempotent: if the lead is already linked to a customer, reuses it
 * instead of creating a duplicate.
 */
export async function convertLeadToCustomer(
  session: AccessSession,
  leadId: string,
  input: ConvertLeadInput,
  byUserId: string | null,
) {
  assertOwner(session);

  const lead = await getLeadForSession(session, leadId);
  if (!lead) return null;

  return prisma.$transaction(async (tx) => {
    const customer =
      lead.customerId != null
        ? await tx.customer.findUniqueOrThrow({ where: { id: lead.customerId } })
        : await tx.customer.create({
            data: {
              brfNamn: lead.brfNamn,
              kommun: lead.kommun,
              kontaktNamn: lead.kontaktNamn,
              epost: lead.epost,
              telefon: lead.telefon,
            },
          });

    const project = await tx.project.create({
      data: {
        customerId: customer.id,
        serviceType: input.serviceType,
        partnerId: input.partnerId ?? lead.assignedPartnerId ?? null,
        status: "PLANERAD",
      },
    });

    if (lead.customerId !== customer.id || lead.status !== LeadStatus.WON) {
      const previousStatus = lead.status;
      await tx.lead.update({
        where: { id: leadId },
        data: { customerId: customer.id, status: LeadStatus.WON },
      });
      if (previousStatus !== LeadStatus.WON) {
        await tx.statusEvent.create({
          data: { leadId, from: previousStatus, to: LeadStatus.WON, byUserId },
        });
      }
    }

    return { customer, project };
  });
}
