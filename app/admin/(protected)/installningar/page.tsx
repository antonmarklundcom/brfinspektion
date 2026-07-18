import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assertOwner } from "@/lib/access";

// OWNER-only per architecture.md §5; middleware.ts also redirects PARTNER
// sessions away from this route before it renders.
export default async function InstallningarPage() {
  const session = await auth();
  if (!session?.user) return null;
  assertOwner(session.user);

  const users = await prisma.user.findMany({ include: { partner: true } });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Användare</h1>
      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-4 py-3">Namn</th>
              <th className="px-4 py-3">E-post</th>
              <th className="px-4 py-3">Roll</th>
              <th className="px-4 py-3">Partner</th>
              <th className="px-4 py-3">Aktiv</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3 text-slate-500">{user.partner?.name ?? "—"}</td>
                <td className="px-4 py-3">{user.active ? "Ja" : "Nej"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-slate-400">
        Skapa nya användare via <code>prisma/seed.ts</code> eller ett kommande admin-formulär
        (Fas 2).
      </p>
    </div>
  );
}
