import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assertOwner } from "@/lib/access";
import { createUser, setUserActive } from "@/lib/users";
import { Role } from "@prisma/client";

// OWNER-only per architecture.md §5; middleware.ts also redirects PARTNER
// sessions away from this route before it renders.
export default async function InstallningarPage() {
  const session = await auth();
  if (!session?.user) return null;
  assertOwner(session.user);

  const [users, partners] = await Promise.all([
    prisma.user.findMany({ include: { partner: true }, orderBy: { createdAt: "asc" } }),
    prisma.partner.findMany(),
  ]);

  async function addUser(formData: FormData) {
    "use server";
    const currentSession = await auth();
    if (!currentSession?.user) return;

    const role = formData.get("role") as Role;
    const partnerId = (formData.get("partnerId") as string) || null;

    await createUser(currentSession.user, {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role,
      partnerId,
    });
    revalidatePath("/admin/installningar");
  }

  async function toggleActive(formData: FormData) {
    "use server";
    const currentSession = await auth();
    if (!currentSession?.user?.id) return;

    const userId = formData.get("userId") as string;
    const nextActive = formData.get("nextActive") === "true";
    await setUserActive({ ...currentSession.user, id: currentSession.user.id }, userId, nextActive);
    revalidatePath("/admin/installningar");
  }

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
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3 text-slate-500">{user.partner?.name ?? "—"}</td>
                <td className="px-4 py-3">{user.active ? "Aktiv" : "Inaktiv"}</td>
                <td className="px-4 py-3">
                  {user.id !== session.user.id && (
                    <form action={toggleActive}>
                      <input type="hidden" name="userId" value={user.id} />
                      <input type="hidden" name="nextActive" value={(!user.active).toString()} />
                      <button type="submit" className="text-blue-800 hover:underline">
                        {user.active ? "Inaktivera" : "Aktivera"}
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="font-medium text-slate-900">Lägg till användare</h2>
        <p className="mt-1 text-sm text-slate-500">
          OWNER ser allt. PARTNER ser bara leads/projekt/uppgifter tilldelade den valda
          partnern — lämna partnerfältet ifyllt endast för PARTNER-roll.
        </p>
        <form action={addUser} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Namn
            </label>
            <input
              id="name"
              name="name"
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              E-post
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Lösenord
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-700">
              Roll
            </label>
            <select
              id="role"
              name="role"
              defaultValue={Role.PARTNER}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            >
              <option value={Role.PARTNER}>Partner</option>
              <option value={Role.OWNER}>Owner</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="partnerId" className="block text-sm font-medium text-slate-700">
              Partner (endast för PARTNER-roll)
            </label>
            <select
              id="partnerId"
              name="partnerId"
              defaultValue=""
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            >
              <option value="">Ingen</option>
              {partners.map((partner) => (
                <option key={partner.id} value={partner.id}>
                  {partner.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-blue-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-900"
            >
              Skapa användare
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
