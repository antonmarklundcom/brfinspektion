import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-600">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-semibold text-slate-900">BRF Inspektion</p>
            <p className="mt-2">
              Oberoende besiktning och kontroll för bostadsrättsföreningar vid stambyte.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/om-oss">Om oss</Link>
            <Link href="/kontakt">Kontakt</Link>
            <Link href="/guider">Guider</Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/integritetspolicy">Integritetspolicy</Link>
            <Link href="/villkor">Villkor</Link>
          </div>
        </div>
        {/* TODO-ORG (plan.md D9): org.nr and legal identity pending operator input */}
        <p className="mt-8 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} BRF Inspektion
        </p>
      </div>
    </footer>
  );
}
