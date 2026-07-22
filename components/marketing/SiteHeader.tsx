import Link from "next/link";

const NAV_LINKS = [
  { href: "/stambyte", label: "Stambyte" },
  { href: "/statusbesiktning", label: "Statusbesiktning" },
  { href: "/kontrollansvarig", label: "Kontrollansvarig" },
  { href: "/garantibesiktning", label: "Garantibesiktning" },
  { href: "/ovk-besiktning", label: "OVK" },
  { href: "/guider", label: "Guider" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
          BRF Inspektion
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-blue-800"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/kostnadskalkyl"
          className="rounded-md bg-blue-800 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-blue-800/20 transition hover:bg-blue-900"
        >
          Kostnadskalkyl
        </Link>
      </div>
    </header>
  );
}
