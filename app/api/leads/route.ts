import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { LeadType, StamTyp, ServiceType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendEmail, notifyEmailAddress } from "@/lib/email";
import { calculate } from "@/lib/calculator";
import { createLeadFollowUpTask } from "@/lib/followups";
import { isRateLimited } from "@/lib/rate-limit";
import { waMeLink } from "@/lib/phone";

const baseSchema = z.object({
  type: z.nativeEnum(LeadType),
  sourcePath: z.string().min(1),
  kontaktNamn: z.string().min(1),
  epost: z.string().email(),
  telefon: z.string().optional(),
  roll: z.string().optional(),
  brfNamn: z.string().min(1),
  kommun: z.string().optional(),
  message: z.string().optional(),
  interestedIn: z.nativeEnum(ServiceType).optional(),
  consent: z.literal(true),
  // honeypot — real users never fill this in
  website: z.string().max(0).optional(),
});

const calculatorSchema = baseSchema.extend({
  type: z.literal(LeadType.CALCULATOR),
  byggAr: z.number().int().min(1850).max(new Date().getFullYear()),
  antalLagenheter: z.number().int().min(1).max(2000),
  stamTyp: z.nativeEnum(StamTyp),
  senasteStambyte: z.enum(["ALDRIG", "0_10", "10_30", "30_PLUS", "VET_EJ"]),
  kandaProblem: z.array(z.string()).default([]),
});

const contactSchema = baseSchema.extend({ type: z.literal(LeadType.CONTACT) });

const requestSchema = z.discriminatedUnion("type", [calculatorSchema, contactSchema]);

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const json = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const data = parsed.data;
  if (data.website) {
    // honeypot tripped — pretend success, do nothing
    return NextResponse.json({ ok: true });
  }

  let calculatorData: ReturnType<typeof calculate> | undefined;
  if (data.type === LeadType.CALCULATOR) {
    calculatorData = calculate({
      byggAr: data.byggAr,
      antalLagenheter: data.antalLagenheter,
      stamTyp: data.stamTyp,
      senasteStambyte: data.senasteStambyte,
      kandaProblem: data.kandaProblem,
    });
  }

  const lead = await prisma.lead.create({
    data: {
      type: data.type,
      sourcePath: data.sourcePath,
      kontaktNamn: data.kontaktNamn,
      epost: data.epost,
      telefon: data.telefon,
      roll: data.roll,
      brfNamn: data.brfNamn,
      kommun: data.kommun,
      message: data.message,
      interestedIn: data.interestedIn,
      consentAt: new Date(),
      byggAr: data.type === LeadType.CALCULATOR ? data.byggAr : undefined,
      antalLagenheter: data.type === LeadType.CALCULATOR ? data.antalLagenheter : undefined,
      stamTyp: data.type === LeadType.CALCULATOR ? data.stamTyp : undefined,
      calculatorData: calculatorData
        ? (JSON.parse(JSON.stringify({ input: data, result: calculatorData })) as Prisma.InputJsonValue)
        : undefined,
    },
  });

  await createLeadFollowUpTask(lead.id, lead.brfNamn);

  const waLink = waMeLink(lead.telefon);

  await sendEmail({
    to: notifyEmailAddress(),
    subject: `Ny lead: ${lead.brfNamn}`,
    html: `<p>Ny lead från ${lead.sourcePath}.</p>
      <p>Kontakt: ${lead.kontaktNamn}, ${lead.epost}${lead.telefon ? `, ${lead.telefon}` : ""}</p>
      ${waLink ? `<p><a href="${waLink}">Öppna i WhatsApp</a></p>` : ""}
      <p><a href="https://brfinspektion.se/admin/leads/${lead.id}">Öppna i admin</a></p>`,
  });

  if (calculatorData) {
    await sendEmail({
      to: lead.epost,
      subject: "Er kostnadsuppskattning från BRF Inspektion",
      html: `<p>Hej ${lead.kontaktNamn},</p>
        <p>Baserat på uppgifterna ni angav är en grov uppskattning
        ${calculatorData.rangeLowSek.toLocaleString("sv-SE")}–${calculatorData.rangeHighSek.toLocaleString("sv-SE")} SEK.
        Riskbedömning: ${calculatorData.riskBand}.</p>
        <p>Detta är en grov uppskattning, inte en offert. Boka en statusbesiktning för en
        korrekt bedömning: <a href="https://brfinspektion.se/statusbesiktning">brfinspektion.se/statusbesiktning</a></p>`,
    });
  }

  return NextResponse.json({ ok: true, leadId: lead.id, result: calculatorData });
}
