"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";

// architecture.md §6.2: GA4 only loads after explicit consent. Two buttons,
// no dark patterns, banner never blocks reading the page.
const CONSENT_STORAGE_KEY = "brf-analytics-consent";

type ConsentState = "unset" | "granted" | "denied";

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): ConsentState {
  const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  return stored === "granted" || stored === "denied" ? stored : "unset";
}

function getServerSnapshot(): ConsentState {
  return "unset";
}

function setConsent(value: "granted" | "denied") {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  listeners.forEach((listener) => listener());
}

export function CookieConsent() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  // Ads tag reuses the GA4 gtag.js loader (same script covers both IDs) — only
  // load it standalone if GA4 is blank but an Ads ID is set (shouldn't happen
  // in practice, but keeps the two envs independently configurable).
  const gtagSrcId = gaId ?? adsId;

  return (
    <>
      {consent === "granted" && gtagSrcId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtagSrcId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              ${gaId ? `gtag('config', '${gaId}');` : ""}
              ${adsId ? `gtag('config', '${adsId}');` : ""}`}
          </Script>
        </>
      )}

      {consent === "unset" && (
        <div
          role="dialog"
          aria-label="Cookie-samtycke"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white px-4 py-4 shadow-lg"
        >
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Vi använder analysverktyg för att förstå hur webbplatsen används. Du väljer själv
              om du godkänner det.{" "}
              <a href="/integritetspolicy" className="underline">
                Läs mer i integritetspolicyn
              </a>
              .
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => setConsent("denied")}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:border-slate-400"
              >
                Endast nödvändiga
              </button>
              <button
                type="button"
                onClick={() => setConsent("granted")}
                className="rounded-md bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-900"
              >
                Godkänn
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
