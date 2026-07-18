import Link from "next/link";
import { auth } from "@/lib/auth";
import { listLeadsForSession } from "@/lib/leads";

export default async function LeadsPage() {
  const session = await auth();
  if (!session?.user) return null;

  const leads = await listLeadsForSession(session.user);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Leads</h1>
      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-4 py-3">Förening</th>
              <th className="px-4 py-3">Kontakt</th>
              <th className="px-4 py-3">Källa</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Skapad</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${lead.id}`} className="text-blue-800 hover:underline">
                    {lead.brfNamn}
                  </Link>
                </td>
                <td className="px-4 py-3">{lead.kontaktNamn}</td>
                <td className="px-4 py-3 text-slate-500">{lead.sourcePath}</td>
                <td className="px-4 py-3">{lead.status}</td>
                <td className="px-4 py-3 text-slate-500">
                  {lead.createdAt.toLocaleDateString("sv-SE")}
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  Inga leads ännu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
