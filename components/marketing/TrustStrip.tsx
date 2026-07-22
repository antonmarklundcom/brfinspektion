import { IconShield, IconUserCheck, IconClipboard, IconClock } from "./icons";

const ITEMS = [
  {
    icon: IconShield,
    title: "Oberoende av entreprenörer",
    description: "Besiktning och kontroll utförs alltid av firmor som inte själva utför byggarbetet.",
  },
  {
    icon: IconUserCheck,
    title: "Fast kontaktperson",
    description: "Samma kontaktperson följer er förening genom hela processen.",
  },
  {
    icon: IconClipboard,
    title: "Kostnadsfri kalkyl",
    description: "Er första kostnads- och riskuppskattning kostar inget och är utan bindning.",
  },
  {
    icon: IconClock,
    title: "Från behov till garanti",
    description: "Vi täcker hela kedjan — kalkyl, upphandling, kontrollansvar och garantibesiktning.",
  },
];

export function TrustStrip() {
  return (
    <section aria-label="Varför BRF Inspektion" className="border-b border-slate-100 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-800">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-slate-900">{title}</p>
              <p className="mt-1 text-sm text-slate-600">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
