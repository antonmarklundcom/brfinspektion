"use client";

import { FormEvent, useState } from "react";
import { LeadType, ServiceType } from "@prisma/client";

interface LeadFormProps {
  sourcePath: string;
  interestedIn?: ServiceType;
  heading?: string;
}

type SubmitState = "idle" | "submitting" | "success" | "error";

export function LeadForm({
  sourcePath,
  interestedIn,
  heading = "Kontakta oss",
}: LeadFormProps) {
  const [state, setState] = useState<SubmitState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    const form = new FormData(event.currentTarget);

    const payload = {
      type: LeadType.CONTACT,
      sourcePath,
      interestedIn,
      kontaktNamn: form.get("kontaktNamn"),
      epost: form.get("epost"),
      telefon: form.get("telefon") || undefined,
      brfNamn: form.get("brfNamn"),
      message: form.get("message") || undefined,
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
      setState("success");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-green-900">
        Tack! Vi återkommer inom kort.
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <h2 className="text-2xl font-semibold text-slate-900">{heading}</h2>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
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
          <label htmlFor="message" className="block text-sm font-medium text-slate-700">
            Meddelande (valfritt)
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
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
          disabled={state === "submitting"}
          className="rounded-md bg-blue-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-900 disabled:opacity-60"
        >
          {state === "submitting" ? "Skickar…" : "Skicka"}
        </button>
        {state === "error" && (
          <p className="text-sm text-red-700">Något gick fel. Försök igen om en stund.</p>
        )}
      </form>
    </section>
  );
}
