import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const { from, error } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: (formData.get("from") as string) || "/admin",
      });
    } catch (err) {
      if (err instanceof AuthError) {
        redirect(`/admin/logga-in?error=1`);
      }
      throw err;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form action={login} className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8">
        <h1 className="text-xl font-semibold text-slate-900">Logga in</h1>
        <input type="hidden" name="from" value={from ?? "/admin"} />
        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            Fel e-post eller lösenord.
          </p>
        )}
        <div className="mt-6">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            E-post
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Lösenord
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="mt-6 w-full rounded-md bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-900"
        >
          Logga in
        </button>
      </form>
    </div>
  );
}
