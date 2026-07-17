import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/admin", label: "Översikt" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/kunder", label: "Kunder" },
  { href: "/admin/uppgifter", label: "Uppgifter" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // middleware.ts already redirects unauthenticated requests before this
  // layout renders; session is expected to be present here.
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <nav className="flex gap-6 text-sm text-slate-700">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-slate-950">
                {link.label}
              </Link>
            ))}
            {session?.user.role === "OWNER" && (
              <Link href="/admin/installningar" className="hover:text-slate-950">
                Inställningar
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>{session?.user.email}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/logga-in" });
              }}
            >
              <button type="submit" className="text-slate-500 hover:text-slate-900">
                Logga ut
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
