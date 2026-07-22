import Link from "next/link";
import { IconShield } from "./icons";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-slate-600">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-800">
                <IconShield className="h-4 w-4" />
              </span>
              <p className="font-semibold text-slate-900">BRF Inspektion</p>
            </div>
            <p className="mt-3 max-w-sm">
              Oberoende besiktning och kontroll för bostadsrättsföreningar vid stambyte.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="mb-1 font-medium text-slate-900">Om oss</p>
            <Link href="/om-oss" className="hover:text-blue-800">
              Om oss
            </Link>
            <Link href="/kontakt" className="hover:text-blue-800">
              Kontakt
            </Link>
            <Link href="/guider" className="hover:text-blue-800">
              Guider
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <p className="mb-1 font-medium text-slate-900">Juridiskt</p>
            <Link href="/integritetspolicy" className="hover:text-blue-800">
              Integritetspolicy
            </Link>
            <Link href="/villkor" className="hover:text-blue-800">
              Villkor
            </Link>
          </div>
        </div>
        {/* TODO-ORG (plan.md D9): org.nr and legal identity pending operator input */}
        <div className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500">
          &copy; {new Date().getFullYear()} BRF Inspektion
        </div>
      </div>
    </footer>
  );
}
