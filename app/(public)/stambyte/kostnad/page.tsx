import { buildMetadata } from "@/lib/seo";
import { faqPageSchema, FaqItem } from "@/lib/schema-org";
import { ServicePageIntro } from "@/components/marketing/ServicePageIntro";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { LeadForm } from "@/components/marketing/LeadForm";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Vad kostar ett stambyte? — kostnadsfri kalkyl",
  description:
    "Så påverkas kostnaden för ett stambyte av byggår, antal lägenheter och typ av stammar. Gör en kostnadsfri kalkyl för er förening.",
  path: "/stambyte/kostnad",
});

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Vad kostar ett stambyte för en bostadsrättsförening?",
    answer:
      "Kostnaden varierar kraftigt beroende på fastighetens ålder, antal lägenheter, typ av stammar och valet mellan traditionellt stambyte och relining. En statusbesiktning ger en tillförlitlig kostnadsbild för er specifika förening.",
  },
  {
    question: "Leder ett stambyte till avgiftshöjning?",
    answer:
      "Ofta, om inte föreningen har tillräcklig fond för yttre underhåll avsatt. En underhållsplan hjälper styrelsen att förutse och planera för kostnaden i god tid.",
  },
  {
    question: "Kan vi få en kostnadsuppskattning utan att betala något?",
    answer:
      "Ja, vår kostnadskalkyl ger en kostnadsfri grov uppskattning baserat på grunduppgifter om föreningen.",
  },
];

export default function StambyteKostnadPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(FAQ_ITEMS)) }}
      />
      <ServicePageIntro
        title="Vad kostar ett stambyte?"
        intro="Kostnaden för ett stambyte beror på flera faktorer som är specifika för er fastighet. Här går vi igenom vad som påverkar priset — och hur ni får en tillförlitlig uppskattning."
      />
      <section className="mx-auto max-w-3xl px-4 pb-8">
        <Link
          href="/kostnadskalkyl"
          className="inline-block rounded-md bg-blue-800 px-6 py-3 text-sm font-medium text-white hover:bg-blue-900"
        >
          Gör en kostnadsfri kalkyl
        </Link>
      </section>
      <FaqAccordion items={FAQ_ITEMS} />
      <LeadForm sourcePath="/stambyte/kostnad" />
    </>
  );
}
