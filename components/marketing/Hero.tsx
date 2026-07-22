import Link from "next/link";
import { IconArrowRight } from "./icons";

const BADGES = ["Oberoende av entreprenörer", "Fast kontaktperson genom hela processen"];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-blue-50/60 via-white to-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <div className="flex flex-wrap gap-2">
            {BADGES.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-900"
              >
                {badge}
              </span>
            ))}
          </div>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Oberoende besiktning och kontroll för er bostadsrättsförening
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
            Stambyte är ofta det största beslutet en styrelse fattar. Vi hjälper er förening
            att göra det tryggt — från kostnadsbedömning till avslutad garantitid.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/kostnadskalkyl"
              className="group inline-flex items-center gap-2 rounded-md bg-blue-800 px-6 py-3 text-sm font-medium text-white shadow-sm shadow-blue-800/20 transition hover:bg-blue-900"
            >
              Gör en kostnadskalkyl — kostnadsfritt
              <IconArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/stambyte"
              className="inline-flex items-center rounded-md border border-slate-300 px-6 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Läs om stambyte
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Ingen bindning. Ni får en riskuppskattning direkt i webbläsaren.
          </p>
        </div>

        <div className="relative mx-auto hidden w-full max-w-md md:block" aria-hidden="true">
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}

function HeroIllustration() {
  return (
    <svg viewBox="0 0 420 420" className="w-full text-blue-800">
      <defs>
        <linearGradient id="hero-panel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eff6ff" />
          <stop offset="100%" stopColor="#dbeafe" />
        </linearGradient>
      </defs>

      <circle cx="210" cy="210" r="190" fill="url(#hero-panel)" />

      {/* dot grid backdrop */}
      {Array.from({ length: 6 }).map((_, row) =>
        Array.from({ length: 6 }).map((_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={90 + col * 48}
            cy={90 + row * 48}
            r="1.6"
            className="fill-blue-300/50"
          />
        )),
      )}

      {/* building */}
      <rect x="120" y="120" width="120" height="200" rx="6" fill="white" stroke="currentColor" strokeWidth="3" />
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 3 }).map((_, col) => (
          <rect
            key={`w-${row}-${col}`}
            x={136 + col * 32}
            y={140 + row * 40}
            width="18"
            height="22"
            rx="2"
            className="fill-blue-100"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        )),
      )}

      {/* clipboard / inspection card */}
      <g transform="translate(228 190)">
        <rect x="0" y="0" width="130" height="150" rx="10" fill="white" stroke="currentColor" strokeWidth="3" />
        <rect x="35" y="-10" width="60" height="20" rx="4" fill="white" stroke="currentColor" strokeWidth="3" />
        <path d="M20 40l16 16 26-26" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M20 76l16 16 26-26" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <line x1="20" y1="118" x2="80" y2="118" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-blue-200" />
      </g>
    </svg>
  );
}
