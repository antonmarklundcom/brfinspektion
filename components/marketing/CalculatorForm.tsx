"use client";

import { FormEvent, useState } from "react";
import { LeadType, StamTyp } from "@prisma/client";
import { trackEvent } from "@/lib/analytics";

const STAM_TYP_LABELS: Record<StamTyp, string> = {
  GJUTJARN: "Gjutjärn",
  PLAST_PVC: "Plast/PVC",
  KOPPAR: "Koppar",
  RELINADE: "Relinade",
  VET_EJ: "Vet ej",
};

const SENASTE_STAMBYTE_LABELS: Record<string, string> = {
  ALDRIG: "Aldrig",
  "0_10": "0–10 år sedan",
  "10_30": "10–30 år sedan",
  "30_PLUS": "Mer än 30 år sedan",
  VET_EJ: "Vet ej",
};

interface CalculatorApiResult {
  rangeLowSek: number;
  rangeHighSek: number;
  riskBand: "LAG" | "MEDEL" | "HOG" | "AKUT";
  riskFactors: string[];
}

const RISK_LABELS: Record<CalculatorApiResult["riskBand"], string> = {
  LAG: "Låg risk",
  MEDEL: "Medelhög risk",
  HOG: "Hög risk",
  AKUT: "Akut — kontakta oss snarast",
};

export function CalculatorForm() {
  const [result, setResult] = useState<CalculatorApiResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(false);
    const form = new FormData(event.currentTarget);

    const payload = {
      type: LeadType.CALCULATOR,
      sourcePath: "/kostnadskalkyl",
      kontaktNamn: form.get("kontaktNamn"),
      epost: form.get("epost"),
      telefon: form.get("telefon") || undefined,
      roll: form.get("roll") || undefined,
      brfNamn: form.get("brfNamn"),
      byggAr: Number(form.get("byggAr")),
      antalLagenheter: Number(form.get("antalLagenheter")),
      stamTyp: form.get("stamTyp"),
      senasteStambyte: form.get("senasteStambyte"),
      kandaProblem: form.getAll("kandaProblem"),
      consent: form.get("consent") === "on",
      website: form.get("website") || "",
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("submit failed");
      const data = await response.json();
      trackEvent("calculator_submit");
      setResult(data.result);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="rounded-lg border border-slate-200 p-6">
        <p className="text-sm font-medium text-blue-800">{RISK_LABELS[result.riskBand]}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">
          {result.rangeLowSek.toLocaleString("sv-SE")}–
          {result.rangeHighSek.toLocaleString("sv-SE")} SEK
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Detta är en grov uppskattning, inte en offert. Vi har även skickat resultatet till
          er e-post.
        </p>
        {result.riskFactors.length > 0 && (
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-600">
            {result.riskFactors.map((factor) => (
              <li key={factor}>{factor}</li>
            ))}
          </ul>
        )}
        <a
          href="/statusbesiktning"
          className="mt-6 inline-block rounded-md bg-blue-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-900"
        >
          Boka en statusbesiktning för en korrekt bedömning
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <div>
        <label htmlFor="byggAr" className="block text-sm font-medium text-slate-700">
          Byggår
        </label>
        <input
          id="byggAr"
          name="byggAr"
          type="number"
          min={1850}
          max={new Date().getFullYear()}
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="antalLagenheter" className="block text-sm font-medium text-slate-700">
          Antal lägenheter
        </label>
        <input
          id="antalLagenheter"
          name="antalLagenheter"
          type="number"
          min={1}
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="stamTyp" className="block text-sm font-medium text-slate-700">
          Typ av stammar
        </label>
        <select
          id="stamTyp"
          name="stamTyp"
          required
          defaultValue=""
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
        >
          <option value="" disabled>
            Välj typ
          </option>
          {Object.entries(STAM_TYP_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="senasteStambyte" className="block text-sm font-medium text-slate-700">
          Senaste stambyte eller relining
        </label>
        <select
          id="senasteStambyte"
          name="senasteStambyte"
          required
          defaultValue=""
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
        >
          <option value="" disabled>
            Välj
          </option>
          {Object.entries(SENASTE_STAMBYTE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <fieldset>
        <legend className="text-sm font-medium text-slate-700">Kända problem</legend>
        <div className="mt-2 space-y-2 text-sm text-slate-600">
          {[
            ["FUKTSKADOR", "Fuktskador"],
            ["DALIG_LUKT", "Dålig lukt"],
            ["STOPP_LACKAGE", "Stopp/läckage"],
            ["INGA_KANDA", "Inga kända problem"],
          ].map(([value, label]) => (
            <label key={value} className="flex items-center gap-2">
              <input type="checkbox" name="kandaProblem" value={value} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <hr className="border-slate-200" />

      <div>
        <label htmlFor="brfNamn" className="block text-sm font-medium text-slate-700">
          Föreningens namn
        </label>
        <input
          id="brfNamn"
          name="brfNamn"
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="kontaktNamn" className="block text-sm font-medium text-slate-700">
          Ditt namn
        </label>
        <input
          id="kontaktNamn"
          name="kontaktNamn"
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="epost" className="block text-sm font-medium text-slate-700">
            E-post
          </label>
          <input
            id="epost"
            name="epost"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="telefon" className="block text-sm font-medium text-slate-700">
            Telefon (valfritt)
          </label>
          <input
            id="telefon"
            name="telefon"
            type="tel"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>
      </div>
      <div>
        <label htmlFor="roll" className="block text-sm font-medium text-slate-700">
          Din roll (valfritt)
        </label>
        <select
          id="roll"
          name="roll"
          defaultValue=""
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
        >
          <option value="">Välj</option>
          <option value="Styrelseledamot">Styrelseledamot</option>
          <option value="Ordförande">Ordförande</option>
          <option value="Förvaltare">Förvaltare</option>
          <option value="Boende">Boende</option>
          <option value="Annat">Annat</option>
        </select>
      </div>
      <div className="flex items-start gap-2">
        <input id="consent" name="consent" type="checkbox" required className="mt-1" />
        <label htmlFor="consent" className="text-sm text-slate-600">
          Jag godkänner att BRF Inspektion sparar mina uppgifter enligt{" "}
          <a href="/integritetspolicy" className="underline">
            integritetspolicyn
          </a>
          .
        </label>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-blue-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-900 disabled:opacity-60"
      >
        {submitting ? "Beräknar…" : "Beräkna kostnad och risk"}
      </button>
      {error && (
        <p className="text-sm text-red-700">Något gick fel. Försök igen om en stund.</p>
      )}
    </form>
  );
}
