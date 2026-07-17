import { buildMetadata } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema-org";
import { ServicePageIntro } from "@/components/marketing/ServicePageIntro";
import { ProcessSteps } from "@/components/marketing/ProcessSteps";
import { LeadForm } from "@/components/marketing/LeadForm";

export const metadata = buildMetadata({
  title: "Stambyte i bostadsrättsförening — oberoende kontroll genom hela processen",
  description:
    "Vad ett stambyte innebär för er förening, och hur oberoende besiktning och kontrollansvarig säkerställer att arbetet håller måttet.",
  path: "/stambyte",
});

export default function StambytePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceSchema({
              name: "Stambyte — besiktning och kontroll",
              description:
                "Oberoende besiktning och kontrollansvarig genom hela stambytesprocessen för bostadsrättsföreningar.",
              serviceType: "Byggkontroll vid stambyte",
              url: "/stambyte",
            }),
          ),
        }}
      />
      <ServicePageIntro
        title="Stambyte i bostadsrättsförening"
        intro="Ett stambyte är ofta det största beslutet en styrelse fattar, både ekonomiskt och praktiskt. Oberoende besiktning och kontrollansvarig genom hela processen minskar risken för fel, förseningar och kostnadsöverskridanden."
      />
      <ProcessSteps
        heading="Från behov till avslutad garantitid"
        steps={[
          {
            title: "Behovsbedömning",
            description: "Är stambyte rätt åtgärd nu, eller räcker relining? Se vår guide.",
          },
          {
            title: "Statusbesiktning och upphandling",
            description:
              "En statusbesiktning ger underlag för förfrågningsunderlag och upphandling av entreprenör.",
          },
          {
            title: "Genomförande och besiktning",
            description:
              "Kontrollansvarig och besiktningsman följer projektet, och de lagstadgade garantibesiktningarna sker 2 och 5 år efter avslut.",
          },
        ]}
      />
      <LeadForm sourcePath="/stambyte" heading="Fundera på stambyte? Hör av er" />
    </>
  );
}
