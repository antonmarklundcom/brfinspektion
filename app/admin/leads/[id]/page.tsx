import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { getLeadForSession, setLeadStatus } from "@/lib/leads";
import { prisma } from "@/lib/prisma";
import { LeadStatus } from "@prisma/client";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) return null;

  const { id } = await params;
  const lead = await getLeadForSession(session.user, id);
  if (!lead) notFound();

  const notes = await prisma.note.findMany({
    where: { leadId: id },
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  async function updateStatus(formData: FormData) {
    "use server";
    const currentSession = await auth();
    if (!currentSession?.user) return;
    const to = formData.get("status") as LeadStatus;
    await setLeadStatus(currentSession.user, id, to, currentSession.user.id ?? null);
    revalidatePath(`/admin/leads/${id}`);
  }

  async function addNote(formData: FormData) {
    "use server";
    const currentSession = await auth();
    if (!currentSession?.user?.id) return;
    const body = formData.get("body") as string;
    if (!body?.trim()) return;
    await prisma.note.create({
      data: { leadId: id, body, authorId: currentSession.user.id },
    });
    revalidatePath(`/admin/leads/${id}`);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">{lead.brfNamn}</h1>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="font-medium text-slate-900">Kontaktuppgifter</h2>
          <dl className="mt-3 space-y-1 text-sm text-slate-600">
            <div>
              <dt className="inline font-medium">Namn: </dt>
              <dd className="inline">{lead.kontaktNamn}</dd>
            </div>
            <div>
              <dt className="inline font-medium">E-post: </dt>
              <dd className="inline">{lead.epost}</dd>
            </div>
            {lead.telefon && (
              <div>
                <dt className="inline font-medium">Telefon: </dt>
                <dd className="inline">{lead.telefon}</dd>
              </div>
            )}
            <div>
              <dt className="inline font-medium">Källa: </dt>
              <dd className="inline">{lead.sourcePath}</dd>
            </div>
          </dl>

          {lead.calculatorData ? (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <h3 className="text-sm font-medium text-slate-900">Kalkylatorsvar</h3>
              <pre className="mt-2 overflow-x-auto rounded bg-slate-50 p-3 text-xs text-slate-600">
                {JSON.stringify(lead.calculatorData, null, 2)}
              </pre>
            </div>
          ) : null}

          {lead.message && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <h3 className="text-sm font-medium text-slate-900">Meddelande</h3>
              <p className="mt-2 text-sm text-slate-600">{lead.message}</p>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="font-medium text-slate-900">Status</h2>
          <form action={updateStatus} className="mt-3 flex gap-2">
            <select
              name="status"
              defaultValue={lead.status}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              {Object.values(LeadStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-md bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-900"
            >
              Uppdatera
            </button>
          </form>

          <h2 className="mt-6 font-medium text-slate-900">Anteckningar</h2>
          <form action={addNote} className="mt-3">
            <textarea
              name="body"
              rows={3}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="Lägg till en anteckning…"
            />
            <button
              type="submit"
              className="mt-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:border-slate-400"
            >
              Spara anteckning
            </button>
          </form>
          <ul className="mt-4 space-y-3">
            {notes.map((note) => (
              <li key={note.id} className="text-sm text-slate-600">
                <p>{note.body}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {note.author.name} — {note.createdAt.toLocaleString("sv-SE")}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
