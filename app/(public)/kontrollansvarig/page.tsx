import { buildMetadata } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema-org";
import { ServicePageIntro } from "@/components/marketing/ServicePageIntro";
import { LeadForm } from "@/components/marketing/LeadForm";
import { ServiceType } from "@prisma/client";

export const metadata = buildMetadata({
  title: "Kontrollansvarig (KA) för bostadsrättsförening",
  description:
    "Kontrollansvarig enligt PBL genom hela stambytesprojektet — oberoende kontroll av att arbetet följer bygglov, kontrollplan och gällande regler.",
  path: "/kontrollansvarig",
});

export default function KontrollansvarigPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceSchema({
              name: "Kontrollansvarig (KA)",
              description:
                "Kontrollansvarig enligt plan- och bygglagen (PBL) för stambytesprojekt i bostadsrättsföreningar.",
              serviceType: "Kontrollansvarig",
              url: "/kontrollansvarig",
            }),
          ),
        }}
      />
      <ServicePageIntro
        title="Kontrollansvarig (KA)"
        intro="Vid de flesta stambyten krävs en kontrollansvarig enligt plan- och bygglagen. Kontrollansvarig bevakar att kontrollplanen följs och att projektet uppfyller gällande krav, oberoende av entreprenören."
      />
      <LeadForm
        sourcePath="/kontrollansvarig"
        interestedIn={ServiceType.KONTROLLANSVARIG}
        heading="Kontakta oss om kontrollansvarig"
      />
    </>
  );
}
