import { buildMetadata } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema-org";
import { ServicePageIntro } from "@/components/marketing/ServicePageIntro";
import { LeadForm } from "@/components/marketing/LeadForm";
import { ServiceType } from "@prisma/client";

export const metadata = buildMetadata({
  title: "Statusbesiktning för bostadsrättsförening",
  description:
    "En statusbesiktning ger styrelsen ett tillförlitligt underlag för om och när stambyte eller större renovering behöver genomföras.",
  path: "/statusbesiktning",
});

export default function StatusbesiktningPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceSchema({
              name: "Statusbesiktning",
              description:
                "Bedömning av föreningens fastighet för att avgöra om och när stambyte eller större renovering behövs.",
              serviceType: "Statusbesiktning",
              url: "/statusbesiktning",
            }),
          ),
        }}
      />
      <ServicePageIntro
        title="Statusbesiktning"
        intro="En statusbesiktning kartlägger fastighetens skick och ger styrelsen ett konkret underlag för beslut — istället för att gissa. Den är ofta första steget efter kostnadskalkylen."
      />
      <LeadForm
        sourcePath="/statusbesiktning"
        interestedIn={ServiceType.STATUSBESIKTNING}
        heading="Boka statusbesiktning"
      />
    </>
  );
}
