import Link from "next/link";
import { ComponentType } from "react";
import { IconClipboard, IconBuilding, IconHandshake, IconShield, IconArrowRight } from "./icons";

interface LadderStep {
  step: string;
  title: string;
  description: string;
  priceLabel: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

// Pricing copy intentionally withholds internal planning bands (plan.md
// D3 — not yet committable publicly). Show "från offert" framing until the
// operator marks specific figures as committable.
const STEPS: LadderStep[] = [
  {
    step: "1",
    title: "Kostnadskalkyl",
    description: "Fri uppskattning av kostnad och risk baserat på er förenings uppgifter.",
    priceLabel: "Kostnadsfritt",
    href: "/kostnadskalkyl",
    icon: IconClipboard,
  },
  {
    step: "2",
    title: "Statusbesiktning",
    description: "Bedömning av om och när stambyte eller större renovering behövs.",
    priceLabel: "Offert efter behov",
    href: "/statusbesiktning",
    icon: IconBuilding,
  },
  {
    step: "3",
    title: "Upphandlingsstöd",
    description: "Förfrågningsunderlag och stöd genom upphandlingen av entreprenör.",
    priceLabel: "Offert efter behov",
    href: "/upphandling",
    icon: IconHandshake,
  },
  {
    step: "4",
    title: "Kontrollansvarig & besiktning",
    description: "Kontrollansvarig (KA) och entreprenadbesiktningar genom hela projektet.",
    priceLabel: "Offert efter projektets omfattning",
    href: "/kontrollansvarig",
    icon: IconShield,
  },
];

export function ServiceLadder() {
  return (
    <section aria-labelledby="ladder-heading" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <div className="max-w-2xl">
        <h2 id="ladder-heading" className="text-2xl font-semibold text-slate-900 md:text-3xl">
          Så följer vi er förening genom hela processen
        </h2>
        <p className="mt-3 text-slate-600">
          Från första kostnadsuppskattning till avslutad garantitid — ett steg i taget, med
          oberoende bedömning i varje del.
        </p>
      </div>

      <div className="relative mt-10 grid gap-6 md:grid-cols-4">
        <div
          aria-hidden="true"
          className="absolute top-10 right-0 left-0 hidden h-px bg-slate-200 md:block"
        />
        {STEPS.map((item) => (
          <Link
            key={item.step}
            href={item.href}
            className="group relative flex flex-col rounded-xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md hover:shadow-blue-900/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-800">
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-slate-400">Steg {item.step}</span>
            </div>
            <h3 className="mt-4 font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{item.description}</p>
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
              <p className="text-sm font-medium text-slate-900">{item.priceLabel}</p>
              <IconArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-800" />
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-sm text-slate-500">
        Därutöver: lagstadgade 2- och 5-årsbesiktningar samt återkommande OVK-besiktning —
        läs mer under{" "}
        <Link href="/garantibesiktning" className="font-medium text-blue-800 underline underline-offset-2">
          garantibesiktning
        </Link>{" "}
        och{" "}
        <Link href="/ovk-besiktning" className="font-medium text-blue-800 underline underline-offset-2">
          OVK-besiktning
        </Link>
        .
      </p>
    </section>
  );
}
