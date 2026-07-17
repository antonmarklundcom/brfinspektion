import Link from "next/link";

interface LadderStep {
  step: string;
  title: string;
  description: string;
  priceLabel: string;
  href: string;
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
  },
  {
    step: "2",
    title: "Statusbesiktning",
    description: "Bedömning av om och när stambyte eller större renovering behövs.",
    priceLabel: "Offert efter behov",
    href: "/statusbesiktning",
  },
  {
    step: "3",
    title: "Upphandlingsstöd",
    description: "Förfrågningsunderlag och stöd genom upphandlingen av entreprenör.",
    priceLabel: "Offert efter behov",
    href: "/upphandling",
  },
  {
    step: "4",
    title: "Kontrollansvarig & besiktning",
    description: "Kontrollansvarig (KA) och entreprenadbesiktningar genom hela projektet.",
    priceLabel: "Offert efter projektets omfattning",
    href: "/kontrollansvarig",
  },
];

export function ServiceLadder() {
  return (
    <section aria-labelledby="ladder-heading" className="mx-auto max-w-6xl px-4 py-16">
      <h2 id="ladder-heading" className="text-2xl font-semibold text-slate-900">
        Så följer vi er förening genom hela processen
      </h2>
      <p className="mt-2 max-w-2xl text-slate-600">
        Från första kostnadsuppskattning till avslutad garantitid — ett steg i taget, med
        oberoende bedömning i varje del.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-4">
        {STEPS.map((item) => (
          <Link
            key={item.step}
            href={item.href}
            className="flex flex-col rounded-lg border border-slate-200 p-5 transition hover:border-blue-800 hover:shadow-sm"
          >
            <span className="text-xs font-medium text-blue-800">Steg {item.step}</span>
            <h3 className="mt-2 font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 flex-1 text-sm text-slate-600">{item.description}</p>
            <p className="mt-4 text-sm font-medium text-slate-900">{item.priceLabel}</p>
          </Link>
        ))}
      </div>
      <p className="mt-6 text-sm text-slate-500">
        Därutöver: lagstadgade 2- och 5-årsbesiktningar samt återkommande OVK-besiktning —
        läs mer under{" "}
        <Link href="/garantibesiktning" className="underline">
          garantibesiktning
        </Link>{" "}
        och{" "}
        <Link href="/ovk-besiktning" className="underline">
          OVK-besiktning
        </Link>
        .
      </p>
    </section>
  );
}
