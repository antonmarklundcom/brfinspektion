import { buildMetadata } from "@/lib/seo";
import { CalculatorForm } from "@/components/marketing/CalculatorForm";

export const metadata = buildMetadata({
  title: "Kostnadskalkyl för stambyte — kostnadsfri uppskattning",
  description:
    "Få en kostnadsfri grov uppskattning av kostnad och risk för stambyte baserat på byggår, antal lägenheter och typ av stammar.",
  path: "/kostnadskalkyl",
});

export default function KostnadskalkylPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold text-slate-900">Kostnadskalkyl för stambyte</h1>
      <p className="mt-4 text-slate-600">
        Svara på några frågor om er förening och få en grov uppskattning av kostnad och risk
        direkt, samt via e-post. Detta är en indikation, inte en offert — nästa steg är
        alltid en statusbesiktning för en korrekt bedömning.
      </p>
      <div className="mt-8">
        <CalculatorForm />
      </div>
    </section>
  );
}
