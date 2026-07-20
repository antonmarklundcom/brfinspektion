"use client";

type ConversionEvent = "calculator_submit" | "contact_submit";

// Google Ads conversion labels (strategy.md §6.2) — blank until the operator's
// Ads account exists and the go-live checklist (strategy.md §6.4) is cleared.
// Never invent a label; the Ads conversion simply doesn't fire without one.
const ADS_CONVERSION_LABELS: Record<ConversionEvent, string | undefined> = {
  calculator_submit: process.env.NEXT_PUBLIC_GOOGLE_ADS_CALCULATOR_LABEL,
  contact_submit: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONTACT_LABEL,
};

// Fires a GA4 event, and a Google Ads conversion if configured, only if the
// visitor has granted analytics consent and gtag is actually loaded
// (architecture.md §6.2). Safe to call unconditionally from client
// components — it's a silent no-op otherwise.
export function trackEvent(name: ConversionEvent): void {
  if (typeof window === "undefined") return;
  const consent = window.localStorage.getItem("brf-analytics-consent");
  if (consent !== "granted") return;

  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", name);

  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const label = ADS_CONVERSION_LABELS[name];
  if (adsId && label) {
    gtag?.("event", "conversion", { send_to: `${adsId}/${label}` });
  }
}
