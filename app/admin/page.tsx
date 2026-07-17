import { auth } from "@/lib/auth";
import { listLeadsForSession } from "@/lib/leads";
import { LeadStatus } from "@prisma/client";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const leads = await listLeadsForSession(session.user);

  const staleThreshold = new Date();
  staleThreshold.setDate(staleThreshold.getDate() - 3);
  const staleNewLeads = leads.filter(
    (lead) => lead.status === LeadStatus.NEW && lead.createdAt < staleThreshold,
  );

  const counts = Object.values(LeadStatus).map((status) => ({
    status,
    count: leads.filter((lead) => lead.status === status).length,
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Översikt</h1>

      {staleNewLeads.length > 0 && (
        <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900">
          <p className="font-medium">
            {staleNewLeads.length} lead{staleNewLeads.length > 1 ? "s" : ""} utan kontakt i
            över 3 dagar
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3 md:grid-cols-6">
        {counts.map(({ status, count }) => (
          <div key={status} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">{status}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
