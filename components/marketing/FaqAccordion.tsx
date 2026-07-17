import { FaqItem } from "@/lib/schema-org";

// The `items` prop here must be the exact same array passed to
// faqPageSchema() on the page — architecture.md §6.3 requires visible
// content and JSON-LD to match exactly.
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <section aria-labelledby="faq-heading" className="mx-auto max-w-3xl px-4 py-16">
      <h2 id="faq-heading" className="text-2xl font-semibold text-slate-900">
        Vanliga frågor
      </h2>
      <dl className="mt-6 divide-y divide-slate-200">
        {items.map((item) => (
          <div key={item.question} className="py-5">
            <dt className="font-medium text-slate-900">{item.question}</dt>
            <dd className="mt-2 text-sm text-slate-600">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
