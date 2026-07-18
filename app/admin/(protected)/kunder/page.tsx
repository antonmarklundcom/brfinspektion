import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectWhereForSession, stripOwnerOnlyFields } from "@/lib/access";

export default async function KunderPage() {
  const session = await auth();
  if (!session?.user) return null;

  // Customers themselves aren't partner-scoped (a customer can have
  // projects with multiple partners); scope via projects instead so a
  // PARTNER session only sees customers they actually have a project with.
  const projects = await prisma.project.findMany({
    where: projectWhereForSession(session.user),
    include: { customer: true },
    distinct: ["customerId"],
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Kunder</h1>
      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-4 py-3">Förening</th>
              <th className="px-4 py-3">Kommun</th>
              <th className="px-4 py-3">Kontakt</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(({ customer }) => {
              const safeCustomer = stripOwnerOnlyFields(session.user, customer);
              return (
                <tr key={safeCustomer.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/kunder/${safeCustomer.id}`} className="text-blue-800 hover:underline">
                      {safeCustomer.brfNamn}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{safeCustomer.kommun ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-500">{safeCustomer.epost ?? "—"}</td>
                </tr>
              );
            })}
            {projects.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                  Inga kunder ännu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
