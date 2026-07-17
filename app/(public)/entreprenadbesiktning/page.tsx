import { buildMetadata } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema-org";
import { ServicePageIntro } from "@/components/marketing/ServicePageIntro";
import { LeadForm } from "@/components/marketing/LeadForm";
import { ServiceType } from "@prisma/client";

export const metadata = buildMetadata({
  title: "Entreprenadbesiktning vid stambyte",
  description:
    "Oberoende entreprenadbesiktning under och efter stambyte, enligt AB04/ABT06, för att säkerställa att utfört arbete håller avtalad kvalitet.",
  path: "/entreprenadbesiktning",
});

export default function EntreprenadbesiktningPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceSchema({
              name: "Entreprenadbesiktning",
              description:
                "Oberoende besiktning av entreprenadarbete vid stambyte enligt AB04/ABT06.",
              serviceType: "Entreprenadbesiktning",
              url: "/entreprenadbesiktning",
            }),
          ),
        }}
      />
      <ServicePageIntro
        title="Entreprenadbesiktning"
        intro="Under och vid avslut av entreprenaden besiktigas det utförda arbetet mot kontrakt och gällande standard (AB04/ABT06). Besiktningen är oberoende av entreprenören och skyddar föreningens intressen."
      />
      <LeadForm
        sourcePath="/entreprenadbesiktning"
        interestedIn={ServiceType.ENTREPRENADBESIKTNING}
        heading="Kontakta oss om entreprenadbesiktning"
      />
    </>
  );
}
