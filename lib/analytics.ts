"use client";

// Fires a GA4 event only if the visitor has granted analytics consent and
// gtag is actually loaded (architecture.md §6.2). Safe to call
// unconditionally from client components — it's a silent no-op otherwise.
export function trackEvent(name: "calculator_submit" | "contact_submit"): void {
  if (typeof window === "undefined") return;
  const consent = window.localStorage.getItem("brf-analytics-consent");
  if (consent !== "granted") return;

  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", name);
}
