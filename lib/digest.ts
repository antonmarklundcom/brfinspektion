import { LeadStatus, TaskStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendEmail, notifyEmailAddress } from "@/lib/email";

const STALE_NEW_LEAD_DAYS = 3;
const UPCOMING_TASK_DAYS = 14;

/**
 * Daily digest to the Owner (architecture.md §6.1, §6.4 step 2): new leads
 * in the last 24h, leads stuck in NEW past the stale threshold, and tasks
 * due within the next two weeks. This is the "unmissable follow-up"
 * mechanism from plan.md — the dashboard shows the same data, but the
 * digest reaches the operator even on days they don't open the app.
 */
export async function sendDailyDigest(): Promise<void> {
  const since = new Date();
  since.setDate(since.getDate() - 1);

  const staleThreshold = new Date();
  staleThreshold.setDate(staleThreshold.getDate() - STALE_NEW_LEAD_DAYS);

  const upcomingThreshold = new Date();
  upcomingThreshold.setDate(upcomingThreshold.getDate() + UPCOMING_TASK_DAYS);

  const [newLeads, staleLeads, upcomingTasks] = await Promise.all([
    prisma.lead.findMany({ where: { createdAt: { gte: since } }, orderBy: { createdAt: "desc" } }),
    prisma.lead.findMany({
      where: { status: LeadStatus.NEW, createdAt: { lt: staleThreshold } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.followUpTask.findMany({
      where: { status: TaskStatus.PENDING, dueDate: { lte: upcomingThreshold } },
      orderBy: { dueDate: "asc" },
    }),
  ]);

  if (newLeads.length === 0 && staleLeads.length === 0 && upcomingTasks.length === 0) {
    return;
  }

  const section = (title: string, items: string[]) =>
    items.length === 0
      ? ""
      : `<h2>${title} (${items.length})</h2><ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;

  const html = [
    section(
      "Nya leads senaste dygnet",
      newLeads.map((lead) => `${lead.brfNamn} — ${lead.kontaktNamn} (${lead.sourcePath})`),
    ),
    section(
      `Leads utan kontakt i över ${STALE_NEW_LEAD_DAYS} dagar`,
      staleLeads.map((lead) => `${lead.brfNamn} — inkom ${lead.createdAt.toLocaleDateString("sv-SE")}`),
    ),
    section(
      "Uppgifter som förfaller inom 14 dagar",
      upcomingTasks.map((task) => `${task.title} — ${task.dueDate.toLocaleDateString("sv-SE")}`),
    ),
    `<p><a href="https://brfinspektion.se/admin">Öppna admin</a></p>`,
  ].join("");

  await sendEmail({
    to: notifyEmailAddress(),
    subject: "Daglig sammanfattning — BRF Inspektion",
    html,
  });
}
