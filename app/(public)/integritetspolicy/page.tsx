import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Integritetspolicy",
  description: "Hur BRF Inspektion behandlar personuppgifter från kostnadskalkylen och kontaktformulär.",
  path: "/integritetspolicy",
});

// TODO-ORG (plan.md D9): personuppgiftsansvarig (org.nr, adress, kontakt)
// must be filled in with the operator's real legal identity before this
// page is published live.
export default function IntegritetspolicyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 prose prose-slate">
      <h1 className="text-3xl font-semibold text-slate-900">Integritetspolicy</h1>
      <p className="mt-4 text-slate-600">
        Denna policy beskriver hur BRF Inspektion behandlar personuppgifter som lämnas via
        kostnadskalkylen eller kontaktformulär på webbplatsen.
      </p>
      <h2 className="mt-8 text-xl font-semibold text-slate-900">Vilka uppgifter samlas in</h2>
      <p className="mt-2 text-slate-600">
        Namn, e-postadress, telefonnummer (om ni anger det), föreningens namn och, vid
        användning av kostnadskalkylen, uppgifter om byggår, antal lägenheter, typ av
        stammar och eventuella kända problem.
      </p>
      <h2 className="mt-8 text-xl font-semibold text-slate-900">Ändamål och laglig grund</h2>
      <p className="mt-2 text-slate-600">
        Uppgifterna används för att besvara er förfrågan, ta fram en kostnadsuppskattning
        och, om ni går vidare, förmedla kontakt med relevant partner. Den lagliga grunden är
        samtycke, som ni lämnar aktivt i samband med att ni skickar in ett formulär.
      </p>
      <h2 className="mt-8 text-xl font-semibold text-slate-900">Lagring</h2>
      <p className="mt-2 text-slate-600">
        Uppgifterna lagras i en databas inom EU och sparas så länge det är relevant för
        ärendet eller den relation som uppstår med er förening.
      </p>
      <h2 className="mt-8 text-xl font-semibold text-slate-900">Era rättigheter</h2>
      <p className="mt-2 text-slate-600">
        Ni har rätt att begära utdrag, rättelse eller radering av era uppgifter. Kontakta oss
        via kontaktformuläret för att utöva dessa rättigheter.
      </p>
      <h2 className="mt-8 text-xl font-semibold text-slate-900">Personuppgiftsansvarig</h2>
      {/* TODO-ORG: fill in real company name, org.nr, and address */}
      <p className="mt-2 text-slate-600">Uppgifter om personuppgiftsansvarig publiceras här inom kort.</p>
    </section>
  );
}
