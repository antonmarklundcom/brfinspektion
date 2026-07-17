import { buildMetadata } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema-org";
import { ServicePageIntro } from "@/components/marketing/ServicePageIntro";
import { LeadForm } from "@/components/marketing/LeadForm";
import { ServiceType } from "@prisma/client";

// Redirect target for brfentreprenad.se (strategy.md §3) — keyword-data.md
// confirms ~0 direct search volume for "brf entreprenad"; this page exists
// for the service ladder, not for SEO.
export const metadata = buildMetadata({
  title: "Upphandlingsstöd för stambyte",
  description:
    "Förfrågningsunderlag och stöd genom upphandlingen av entreprenör för stambyte i bostadsrättsförening.",
  path: "/upphandling",
});

export default function UpphandlingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceSchema({
              name: "Upphandlingsstöd",
              description:
                "Förfrågningsunderlag och stöd genom upphandlingen av entreprenör för stambyte.",
              serviceType: "Upphandlingsstöd",
              url: "/upphandling",
            }),
          ),
        }}
      />
      <ServicePageIntro
        title="Upphandlingsstöd"
        intro="Ett tydligt förfrågningsunderlag är avgörande för att få jämförbara anbud och undvika missförstånd senare i projektet. Vi hjälper styrelsen att ta fram underlaget och utvärdera anbuden."
      />
      <LeadForm
        sourcePath="/upphandling"
        interestedIn={ServiceType.UPPHANDLINGSSTOD}
        heading="Kontakta oss om upphandlingsstöd"
      />
    </>
  );
}
