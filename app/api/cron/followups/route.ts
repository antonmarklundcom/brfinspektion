import { NextRequest, NextResponse } from "next/server";
import { TaskStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendEmail, notifyEmailAddress } from "@/lib/email";
import { sendDailyDigest } from "@/lib/digest";
import { sweepMissingLeadFollowUps } from "@/lib/followups";

// Invoked daily by an external scheduler (Hostinger hPanel cron or
// cron-job.org — architecture.md §6.4, operator to confirm which).
// Idempotent via `notifiedAt` so re-runs never double-send.

function isAuthorized(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  return Boolean(secret) && auth === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const in14Days = new Date();
  in14Days.setDate(in14Days.getDate() + 14);

  const dueTasks = await prisma.followUpTask.findMany({
    where: {
      status: TaskStatus.PENDING,
      notifiedAt: null,
      dueDate: { lte: in14Days },
    },
    include: { customer: true, lead: true, partner: true },
  });

  for (const task of dueTasks) {
    const recipients = [notifyEmailAddress()];
    // Partner notification is opt-in until partner user records exist with
    // verified email addresses managed in /admin/installningar (Phase 2).
    await sendEmail({
      to: recipients,
      subject: `Uppgift förfaller: ${task.title}`,
      html: `<p>${task.title}</p>
        <p>Förfaller: ${task.dueDate.toLocaleDateString("sv-SE")}</p>
        <p><a href="https://brfinspektion.se/admin/uppgifter">Öppna i admin</a></p>`,
    });
    await prisma.followUpTask.update({
      where: { id: task.id },
      data: { notifiedAt: new Date() },
    });
  }

  await sendDailyDigest();
  const sweptCount = await sweepMissingLeadFollowUps();

  return NextResponse.json({ ok: true, notified: dueTasks.length, swept: sweptCount });
}
