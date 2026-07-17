import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { GUIDES } from "@/lib/guider";

export const metadata = buildMetadata({
  title: "Guider för bostadsrättsföreningar",
  description: "Guider om underhållsplan, stambyte och besiktning för styrelser i bostadsrättsföreningar.",
  path: "/guider",
});

export default function GuiderIndexPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold text-slate-900">Guider</h1>
      <ul className="mt-8 space-y-6">
        {GUIDES.map((guide) => (
          <li key={guide.slug}>
            <Link href={`/guider/${guide.slug}`} className="text-lg font-medium text-blue-800 hover:underline">
              {guide.title}
            </Link>
            <p className="mt-1 text-sm text-slate-600">{guide.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
