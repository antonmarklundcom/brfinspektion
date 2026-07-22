import { buildMetadata } from "@/lib/seo";
import { faqPageSchema, FaqItem } from "@/lib/schema-org";
import { Hero } from "@/components/marketing/Hero";
import { TrustStrip } from "@/components/marketing/TrustStrip";
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

      <Hero />
      <TrustStrip />

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
