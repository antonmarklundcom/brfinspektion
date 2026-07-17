import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Villkor",
  description: "Villkor för användning av brfinspektion.se och de tjänster som förmedlas via webbplatsen.",
  path: "/villkor",
});

export default function VillkorPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 prose prose-slate">
      <h1 className="text-3xl font-semibold text-slate-900">Villkor</h1>
      <p className="mt-4 text-slate-600">
        BRF Inspektion är en förmedlingstjänst som kopplar samman bostadsrättsföreningar med
        oberoende besiktningsmän och kontrollansvariga. Kostnadskalkylen ger en grov
        uppskattning och utgör inte en offert eller ett bindande avtal. Faktiska priser
        avtalas separat med den utförande partnern.
      </p>
      {/* TODO-ORG (plan.md D9): full legal terms pending operator/legal input */}
    </section>
  );
}
