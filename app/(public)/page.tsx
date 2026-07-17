import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { faqPageSchema, FaqItem } from "@/lib/schema-org";
import { ServiceLadder } from "@/components/marketing/ServiceLadder";
import { ProcessSteps } from "@/components/marketing/ProcessSteps";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { LeadForm } from "@/components/marketing/LeadForm";

export const metadata = buildMetadata({
  title: "Oberoende besiktning och kontroll för bostadsrättsföreningar",
  description:
    "BRF Inspektion kopplar samman styrelser med oberoende besiktningsmän och kontrollansvariga inför och under stambyte.",
  path: "/",
});

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Vad gör BRF Inspektion?",
    answer:
      "Vi kopplar samman bostadsrättsföreningars styrelser med oberoende besiktningsmän och kontrollansvariga, från första kostnadsbedömning till avslutad garantitid vid stambyte.",
  },
  {
    question: "Är ni oberoende av entreprenörerna?",
    answer:
      "Ja. Besiktning och kontroll utförs av firmor som inte själva utför entreprenadarbetet, vilket är en förutsättning för en opartisk bedömning.",
  },
  {
    question: "Vad kostar det att komma i kontakt med er?",
    answer:
      "Kostnadskalkylen är helt kostnadsfri. Övriga tjänster offereras utifrån föreningens specifika behov.",
  },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(FAQ_ITEMS)) }}
      />

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-500">
          <span className="rounded-full border border-slate-200 px-3 py-1">
            Oberoende av entreprenörer
          </span>
          <span className="rounded-full border border-slate-200 px-3 py-1">
            Fast kontaktperson
          </span>
        </div>
        <h1 className="mt-6 max-w-3xl text-3xl font-semibold text-slate-900 md:text-4xl">
          Oberoende besiktning och kontroll för er bostadsrättsförening
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Stambyte är ofta det största beslutet en styrelse fattar. Vi hjälper er förening
          att göra det tryggt — från kostnadsbedömning till avslutad garantitid.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/kostnadskalkyl"
            className="rounded-md bg-blue-800 px-6 py-3 text-sm font-medium text-white hover:bg-blue-900"
          >
            Gör en kostnadskalkyl — kostnadsfritt
          </Link>
          <Link
            href="/stambyte"
            className="rounded-md border border-slate-300 px-6 py-3 text-sm font-medium text-slate-900 hover:border-slate-400"
          >
            Läs om stambyte
          </Link>
        </div>
      </section>

      <ServiceLadder />

      <ProcessSteps
        steps={[
          {
            title: "Kostnadskalkyl",
            description:
              "Ni fyller i grunduppgifter om föreningen och får en grov kostnads- och riskuppskattning direkt.",
          },
          {
            title: "Bedömning och upphandling",
            description:
              "Vid behov genomförs en statusbesiktning och vi tar fram underlag för upphandling av entreprenör.",
          },
          {
            title: "Genomförande och garanti",
            description:
              "Kontrollansvarig och besiktningsman följer projektet genom byggtiden och de lagstadgade garantibesiktningarna efteråt.",
          },
        ]}
      />

      <FaqAccordion items={FAQ_ITEMS} />

      <LeadForm sourcePath="/" heading="Har ni frågor? Kontakta oss" />
    </>
  );
}
