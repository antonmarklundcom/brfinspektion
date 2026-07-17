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
    <header className="border-b border-slate-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          BRF Inspektion
        </Link>
        <nav className="hidden gap-6 text-sm text-slate-700 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-slate-950">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/kostnadskalkyl"
          className="rounded-md bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-900"
        >
          Kostnadskalkyl
        </Link>
      </div>
    </header>
  );
}
