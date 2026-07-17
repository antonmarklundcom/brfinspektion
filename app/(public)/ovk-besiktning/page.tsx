import { buildMetadata } from "@/lib/seo";
import { serviceSchema, faqPageSchema, FaqItem } from "@/lib/schema-org";
import { ServicePageIntro } from "@/components/marketing/ServicePageIntro";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { LeadForm } from "@/components/marketing/LeadForm";
import { ServiceType } from "@prisma/client";

// Consolidates ovk besiktning bostadsrätt/brf/lägenhet variants onto one
// page (strategy.md §4.1) — this is the highest-volume commercial keyword
// in keyword-data.md (70/mo on the primary term).
export const metadata = buildMetadata({
  title: "OVK-besiktning för bostadsrättsförening",
  description:
    "Obligatorisk ventilationskontroll (OVK) för bostadsrättsföreningar — vad kravet innebär, hur ofta det gäller och vad som händer om det inte genomförs.",
  path: "/ovk-besiktning",
});

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Vad är OVK?",
    answer:
      "OVK, obligatorisk ventilationskontroll, är en lagstadgad besiktning av fastighetens ventilationssystem som säkerställer att det fungerar som avsett och uppfyller myndighetskrav.",
  },
  {
    question: "Hur ofta krävs OVK?",
    answer:
      "Intervallet beror på typen av ventilationssystem — vanligtvis vart tredje eller vart sjätte år. Vilket intervall som gäller för er fastighet avgörs av systemtypen, inte av en generell regel.",
  },
  {
    question: "Vad händer om vi inte genomför OVK i tid?",
    answer:
      "Kommunen kan förelägga fastighetsägaren att genomföra kontrollen, i vissa fall förenat med vite. Ett giltigt OVK-protokoll krävs också ofta vid försäljning och vissa försäkringsärenden.",
  },
  {
    question: "Vad kostar en OVK-besiktning?",
    answer:
      "Kostnaden beror på fastighetens storlek och ventilationssystemets utformning. Kontakta oss för en bedömning av er förenings behov.",
  },
];

export default function OvkBesiktningPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceSchema({
              name: "OVK-besiktning",
              description:
                "Obligatorisk ventilationskontroll för bostadsrättsföreningar, återkommande vart tredje eller sjätte år beroende på systemtyp.",
              serviceType: "OVK-besiktning",
              url: "/ovk-besiktning",
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(FAQ_ITEMS)) }}
      />
      <ServicePageIntro
        title="OVK-besiktning"
        intro="Obligatorisk ventilationskontroll (OVK) är ett lagkrav som återkommer med jämna mellanrum. Vi håller reda på när er förenings nästa besiktning ska genomföras och bokar den åt er."
      />
      <FaqAccordion items={FAQ_ITEMS} />
      <LeadForm sourcePath="/ovk-besiktning" interestedIn={ServiceType.OVK} heading="Kontakta oss om OVK" />
    </>
  );
}
