import { prisma } from "@/lib/prisma";
import { AccessSession, projectWhereForSession } from "@/lib/access";
import { generateFollowUpTasksForProject } from "@/lib/followups";
import { ServiceType } from "@prisma/client";

export async function listProjectsForCustomer(session: AccessSession, customerId: string) {
  return prisma.project.findMany({
    where: { customerId, ...projectWhereForSession(session) },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProjectForSession(session: AccessSession, id: string) {
  return prisma.project.findFirst({ where: { id, ...projectWhereForSession(session) } });
}

export interface CreateProjectInput {
  customerId: string;
  serviceType: ServiceType;
  partnerId?: string | null;
  startDate?: Date | null;
  description?: string | null;
}

/**
 * OWNER-only: creating a project is a business commitment (which partner
 * delivers which tier), same rationale as convertLeadToCustomer.
 */
export async function createProject(session: AccessSession, input: CreateProjectInput) {
  if (session.role !== "OWNER") {
    throw new Error("Only OWNER may create projects");
  }
  return prisma.project.create({
    data: {
      customerId: input.customerId,
      serviceType: input.serviceType,
      partnerId: input.partnerId ?? null,
      startDate: input.startDate ?? null,
      description: input.description ?? null,
      status: "PLANERAD",
    },
  });
}

/**
 * Marks a project SLUTFORD and generates the statutory follow-up tasks
 * (architecture.md §4.6). Scoped fetch means a PARTNER session can only
 * complete a project they're actually assigned to — but completion is the
 * trigger for follow-up task generation, so it's allowed for the assigned
 * partner as well as OWNER (they're the ones who did the work).
 */
export async function markProjectCompleted(
  session: AccessSession,
  projectId: string,
  completedDate: Date,
) {
  const project = await getProjectForSession(session, projectId);
  if (!project) return null;

  await prisma.project.update({
    where: { id: projectId },
    data: { status: "SLUTFORD", completedDate },
  });

  await generateFollowUpTasksForProject(projectId);

  return prisma.project.findUniqueOrThrow({ where: { id: projectId } });
}
