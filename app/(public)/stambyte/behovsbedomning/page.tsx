import { buildMetadata } from "@/lib/seo";
import { ServicePageIntro } from "@/components/marketing/ServicePageIntro";
import { LeadForm } from "@/components/marketing/LeadForm";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Behöver vår förening stambyte? — så vet ni",
  description:
    "Tecken på att en förening behöver stambyte, och hur en statusbesiktning avgör om relining räcker eller om ett fullständigt stambyte krävs.",
  path: "/stambyte/behovsbedomning",
});

export default function BehovsbedomningPage() {
  return (
    <>
      <ServicePageIntro
        title="Behöver er förening stambyte?"
        intro="Återkommande stopp, fuktskador, dålig lukt eller stammar som närmar sig 40–50 år är tecken på att det är dags att utreda behovet. En statusbesiktning ger ett underlag att fatta beslut utifrån — inte en magkänsla."
      />
      <section className="mx-auto max-w-3xl px-4 pb-16">
        <Link
          href="/kostnadskalkyl"
          className="inline-block rounded-md bg-blue-800 px-6 py-3 text-sm font-medium text-white hover:bg-blue-900"
        >
          Gör en kostnadsfri kalkyl
        </Link>
      </section>
      <LeadForm sourcePath="/stambyte/behovsbedomning" />
    </>
  );
}
