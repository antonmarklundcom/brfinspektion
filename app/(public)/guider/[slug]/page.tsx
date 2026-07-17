import { notFound } from "next/navigation";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { articleSchema, faqPageSchema } from "@/lib/schema-org";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { GUIDES, getGuideBySlug } from "@/lib/guider";

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  return buildMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guider/${guide.slug}`,
  });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleSchema({
              title: guide.title,
              description: guide.description,
              url: `/guider/${guide.slug}`,
              datePublished: guide.publishedAt,
            }),
          ),
        }}
      />
      {guide.faq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(guide.faq)) }}
        />
      )}
      <article className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-semibold text-slate-900">{guide.title}</h1>
        <div className="prose prose-slate mt-6 space-y-4">
          {guide.body.map((paragraph, index) => (
            <p key={index} className="text-slate-600">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/kostnadskalkyl"
            className="inline-block rounded-md bg-blue-800 px-6 py-3 text-sm font-medium text-white hover:bg-blue-900"
          >
            Gör en kostnadsfri kalkyl
          </Link>
        </div>
      </article>
      {guide.faq && <FaqAccordion items={guide.faq} />}
    </>
  );
}
