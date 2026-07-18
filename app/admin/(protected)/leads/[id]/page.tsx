import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { assignLeadToPartner, getLeadForSession, setLeadStatus } from "@/lib/leads";
import { convertLeadToCustomer } from "@/lib/customers";
import { prisma } from "@/lib/prisma";
import { LeadStatus, ServiceType } from "@prisma/client";

const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  STATUSBESIKTNING: "Statusbesiktning",
  UPPHANDLINGSSTOD: "Upphandlingsstöd",
  KONTROLLANSVARIG: "Kontrollansvarig",
  ENTREPRENADBESIKTNING: "Entreprenadbesiktning",
  GARANTIBESIKTNING_2AR: "Garantibesiktning (2 år)",
  GARANTIBESIKTNING_5AR: "Garantibesiktning (5 år)",
  OVK: "OVK-besiktning",
  UNDERHALLSPLAN: "Underhållsplan",
  OVRIGT: "Övrigt",
};

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

  const partners = session.user.role === "OWNER" ? await prisma.partner.findMany() : [];

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

  async function assignPartner(formData: FormData) {
    "use server";
    const currentSession = await auth();
    if (!currentSession?.user) return;
    const partnerId = (formData.get("partnerId") as string) || null;
    await assignLeadToPartner(currentSession.user, id, partnerId);
    revalidatePath(`/admin/leads/${id}`);
  }

  async function convertToCustomer(formData: FormData) {
    "use server";
    const currentSession = await auth();
    if (!currentSession?.user?.id) return;
    const serviceType = formData.get("serviceType") as ServiceType;
    const partnerId = (formData.get("conversionPartnerId") as string) || null;
    const result = await convertLeadToCustomer(
      currentSession.user,
      id,
      { serviceType, partnerId },
      currentSession.user.id,
    );
    if (result) {
      redirect(`/admin/kunder/${result.customer.id}`);
    }
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
                <p className="mt-1 text-xs text-slate-500">
                  {note.author.name} — {note.createdAt.toLocaleString("sv-SE")}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {session.user.role === "OWNER" && (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="font-medium text-slate-900">Tilldela partner</h2>
            <p className="mt-1 text-sm text-slate-500">
              Styr vilken partner som får se denna lead i sin egen vy.
            </p>
            <form action={assignPartner} className="mt-3 flex gap-2">
              <select
                name="partnerId"
                defaultValue={lead.assignedPartnerId ?? ""}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">Ingen</option>
                {partners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:border-slate-400"
              >
                Spara
              </button>
            </form>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="font-medium text-slate-900">Konvertera till kund</h2>
            {lead.customerId ? (
              <p className="mt-2 text-sm text-slate-600">
                Redan kopplad till en kund.{" "}
                <Link href={`/admin/kunder/${lead.customerId}`} className="text-blue-800 underline">
                  Öppna kundpost
                </Link>
              </p>
            ) : (
              <>
                <p className="mt-1 text-sm text-slate-500">
                  Skapar en kundpost och ett projekt av denna lead, och sätter status till WON.
                </p>
                <form action={convertToCustomer} className="mt-3 space-y-2">
                  <select
                    name="serviceType"
                    defaultValue={lead.interestedIn ?? ""}
                    required
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="" disabled>
                      Välj tjänst
                    </option>
                    {Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <select
                    name="conversionPartnerId"
                    defaultValue={lead.assignedPartnerId ?? ""}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="">Ingen partner vald</option>
                    {partners.map((partner) => (
                      <option key={partner.id} value={partner.id}>
                        {partner.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-md bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-900"
                  >
                    Konvertera till kund
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
