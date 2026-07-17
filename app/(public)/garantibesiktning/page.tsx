import { buildMetadata } from "@/lib/seo";
import { serviceSchema, faqPageSchema, FaqItem } from "@/lib/schema-org";
import { ServicePageIntro } from "@/components/marketing/ServicePageIntro";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { LeadForm } from "@/components/marketing/LeadForm";
import { ServiceType } from "@prisma/client";

// Consolidation showcase (strategy.md §4.1, architecture.md §2): this ONE
// page absorbs all 2-year/5-year × brf/bostadsrätt/lägenhet keyword
// variants instead of separate thin pages per variant. Do not split.
export const metadata = buildMetadata({
  title: "2- och 5-årsbesiktning (garantibesiktning) för bostadsrättsförening",
  description:
    "Vad 2-årsbesiktningen och 5-årsbesiktningen innebär för er bostadsrättsförening efter stambyte, enligt AB04/ABT06.",
  path: "/garantibesiktning",
});

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Vad är en 2-årsbesiktning?",
    answer:
      "En 2-årsbesiktning är en lagstadgad kontroll som genomförs cirka två år efter att entreprenaden avslutats, enligt AB04/ABT06. Syftet är att upptäcka fel som uppstått eller blivit synliga under garantitiden.",
  },
  {
    question: "Vad är en 5-årsbesiktning?",
    answer:
      "5-årsbesiktningen görs cirka fem år efter avslutad entreprenad och är den sista kontrollen inom den utökade garantitiden för vissa typer av arbeten.",
  },
  {
    question: "Gäller det vår bostadsrättsförening?",
    answer:
      "Ja — om föreningen genomfört ett stambyte eller annan entreprenad med en kontrollansvarig och slutbesiktning, gäller garantibesiktningarna enligt det avtal som slöts med entreprenören.",
  },
  {
    question: "Vem betalar för garantibesiktningen?",
    answer:
      "Kostnaden regleras normalt i entreprenadavtalet. Kontakta oss för att reda ut vad som gäller för er förenings specifika avtal.",
  },
  {
    question: "Vad händer om fel upptäcks vid besiktningen?",
    answer:
      "Upptäckta fel som omfattas av garantin ska åtgärdas av entreprenören. Besiktningsmannen dokumenterar felen i ett besiktningsutlåtande som blir underlag för åtgärd.",
  },
  {
    question: "Vad säger AB04 och ABT06 om garantibesiktning?",
    answer:
      "AB04 (utförandeentreprenader) och ABT06 (totalentreprenader) är de standardavtal som reglerar garantitider och besiktningsskyldighet i svenska byggentreprenader, inklusive stambyten.",
  },
  {
    question: "Gäller besiktningen även enskilda lägenheter?",
    answer:
      "Besiktningen omfattar de delar av fastigheten som ingått i entreprenaden, vilket vid stambyte oftast inkluderar arbete i enskilda lägenheter. Omfattningen framgår av kontrollplanen.",
  },
];

export default function GarantibesiktningPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceSchema({
              name: "Garantibesiktning (2- och 5-årsbesiktning)",
              description:
                "Lagstadgade 2- och 5-årsbesiktningar efter stambyte eller annan entreprenad, enligt AB04/ABT06.",
              serviceType: "Garantibesiktning",
              url: "/garantibesiktning",
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(FAQ_ITEMS)) }}
      />
      <ServicePageIntro
        title="2- och 5-årsbesiktning (garantibesiktning)"
        intro="Efter ett avslutat stambyte återstår de lagstadgade garantibesiktningarna — 2 år och 5 år efter avslutad entreprenad. Vi håller koll på tidpunkterna åt er och bokar besiktningsmannen i god tid."
      />
      <FaqAccordion items={FAQ_ITEMS} />
      <LeadForm
        sourcePath="/garantibesiktning"
        interestedIn={ServiceType.GARANTIBESIKTNING_2AR}
        heading="Kontakta oss om garantibesiktning"
      />
    </>
  );
}
