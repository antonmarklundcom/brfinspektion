import { buildMetadata } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema-org";
import { ServicePageIntro } from "@/components/marketing/ServicePageIntro";
import { LeadForm } from "@/components/marketing/LeadForm";
import { ServiceType } from "@prisma/client";

// Targets the largest organic opportunity in keyword-data.md: "underhållsplan
// brf" (720/mo) plus the long-tail cluster (strategy.md §4.1). This page
// owns the head term; guides (strategy.md §5.3) own the long-tail variants.
export const metadata = buildMetadata({
  title: "Underhållsplan för bostadsrättsförening",
  description:
    "En underhållsplan ger styrelsen kontroll över kommande kostnader, inklusive stambyte, och underlag för avsättning till fonden för yttre underhåll.",
  path: "/underhallsplan",
});

export default function UnderhallsplanPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceSchema({
              name: "Underhållsplan",
              description:
                "Underhållsplan för bostadsrättsföreningar som underlag för långsiktig ekonomisk planering, inklusive stambyte.",
              serviceType: "Underhållsplan",
              url: "/underhallsplan",
            }),
          ),
        }}
      />
      <ServicePageIntro
        title="Underhållsplan"
        intro="En underhållsplan ger styrelsen en långsiktig bild av kommande underhållsbehov och kostnader — grunden för att sätta rätt avgiftsnivå i god tid innan stora projekt som stambyte blir akuta."
      />
      <LeadForm
        sourcePath="/underhallsplan"
        interestedIn={ServiceType.UNDERHALLSPLAN}
        heading="Kontakta oss om underhållsplan"
      />
    </>
  );
}
