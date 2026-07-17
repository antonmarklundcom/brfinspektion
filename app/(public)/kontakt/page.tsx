import { buildMetadata } from "@/lib/seo";
import { ServicePageIntro } from "@/components/marketing/ServicePageIntro";
import { LeadForm } from "@/components/marketing/LeadForm";

export const metadata = buildMetadata({
  title: "Kontakt",
  description: "Kontakta BRF Inspektion för frågor om stambyte, besiktning eller kontroll.",
  path: "/kontakt",
});

export default function KontaktPage() {
  return (
    <>
      <ServicePageIntro
        title="Kontakt"
        intro="Har ni frågor om er förenings behov av besiktning eller kontroll? Fyll i formuläret så återkommer vi."
      />
      <LeadForm sourcePath="/kontakt" heading="Skicka meddelande" />
    </>
  );
}
