import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripOwnerOnlyFields } from "@/lib/access";
import { createProject, listProjectsForCustomer, markProjectCompleted } from "@/lib/projects";
import { ServiceType } from "@prisma/client";

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

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) return null;

  const { id } = await params;

  const projects = await listProjectsForCustomer(session.user, id);
  // A PARTNER session with zero visible projects on this customer has no
  // business seeing the customer record at all (architecture.md §5).
  if (projects.length === 0 && session.user.role !== "OWNER") notFound();

  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) notFound();

  const partners = session.user.role === "OWNER" ? await prisma.partner.findMany() : [];

  const tasks = await prisma.followUpTask.findMany({
    where: { customerId: id, ...(session.user.role === "OWNER" ? {} : { partnerId: session.user.partnerId }) },
    orderBy: { dueDate: "asc" },
  });

  async function addProject(formData: FormData) {
    "use server";
    const currentSession = await auth();
    if (!currentSession?.user) return;
    const serviceType = formData.get("serviceType") as ServiceType;
    const partnerId = (formData.get("partnerId") as string) || null;
    await createProject(currentSession.user, { customerId: id, serviceType, partnerId });
    revalidatePath(`/admin/kunder/${id}`);
  }

  async function completeProject(formData: FormData) {
    "use server";
    const currentSession = await auth();
    if (!currentSession?.user) return;
    const projectId = formData.get("projectId") as string;
    const completedDateRaw = formData.get("completedDate") as string;
    if (!projectId || !completedDateRaw) return;
    await markProjectCompleted(currentSession.user, projectId, new Date(completedDateRaw));
    revalidatePath(`/admin/kunder/${id}`);
  }

  const safeCustomer = stripOwnerOnlyFields(session.user, customer);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">{safeCustomer.brfNamn}</h1>
      <dl className="mt-2 text-sm text-slate-600">
        {safeCustomer.kommun && <p>Kommun: {safeCustomer.kommun}</p>}
        {safeCustomer.epost && <p>E-post: {safeCustomer.epost}</p>}
      </dl>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="font-medium text-slate-900">Projekt</h2>
        <ul className="mt-3 space-y-4">
          {projects.map((project) => {
            const safeProject = stripOwnerOnlyFields(session.user, project);
            return (
              <li key={project.id} className="rounded-md border border-slate-100 p-4">
                <p className="font-medium text-slate-900">
                  {SERVICE_TYPE_LABELS[project.serviceType]}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Status: {project.status}
                  {project.completedDate &&
                    ` · Avslutad ${project.completedDate.toLocaleDateString("sv-SE")}`}
                  {"contractValueSek" in safeProject && safeProject.contractValueSek
                    ? ` · ${safeProject.contractValueSek.toLocaleString("sv-SE")} SEK`
                    : ""}
                </p>
                {project.status !== "SLUTFORD" && (
                  <form action={completeProject} className="mt-3 flex items-end gap-2">
                    <input type="hidden" name="projectId" value={project.id} />
                    <div>
                      <label className="block text-xs text-slate-500">Avslutsdatum</label>
                      <input
                        type="date"
                        name="completedDate"
                        required
                        className="mt-1 rounded-md border border-slate-300 px-2 py-1 text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-900 hover:border-slate-400"
                    >
                      Markera avslutad
                    </button>
                  </form>
                )}
              </li>
            );
          })}
          {projects.length === 0 && <p className="text-slate-400">Inga projekt ännu.</p>}
        </ul>

        {session.user.role === "OWNER" && (
          <form action={addProject} className="mt-6 flex flex-wrap items-end gap-2 border-t border-slate-100 pt-4">
            <div>
              <label className="block text-xs text-slate-500">Ny tjänst</label>
              <select
                name="serviceType"
                required
                defaultValue=""
                className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
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
            </div>
            <div>
              <label className="block text-xs text-slate-500">Partner</label>
              <select
                name="partnerId"
                defaultValue=""
                className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">Ingen</option>
                {partners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="rounded-md bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-900"
            >
              Lägg till projekt
            </button>
          </form>
        )}
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="font-medium text-slate-900">Uppföljningsuppgifter</h2>
        <ul className="mt-3 space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="text-sm text-slate-600">
              {task.title} — förfaller {task.dueDate.toLocaleDateString("sv-SE")}
              {task.status !== "PENDING" ? ` (${task.status})` : ""}
            </li>
          ))}
          {tasks.length === 0 && (
            <p className="text-slate-400">Inga uppföljningsuppgifter genererade ännu.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
