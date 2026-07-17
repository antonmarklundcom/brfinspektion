import { buildMetadata } from "@/lib/seo";
import { ServicePageIntro } from "@/components/marketing/ServicePageIntro";

export const metadata = buildMetadata({
  title: "Om oss",
  description: "Om BRF Inspektion och de oberoende partners vi samarbetar med.",
  path: "/om-oss",
});

// TODO-PARTNER-CREDENTIALS (plan.md D10): partner firm names and certifications
// (e.g. certifierad kontrollansvarig, OVK-behörighet) may only be published
// once confirmed by the partners themselves.
export default function OmOssPage() {
  return (
    <ServicePageIntro
      title="Om BRF Inspektion"
      intro="BRF Inspektion kopplar samman bostadsrättsföreningars styrelser med oberoende besiktningsmän och kontrollansvariga vid stambyte och andra större projekt. Vi samordnar kontakten och håller reda på lagstadgade uppföljningar, medan besiktning och kontroll utförs av certifierade partners."
    />
  );
}
