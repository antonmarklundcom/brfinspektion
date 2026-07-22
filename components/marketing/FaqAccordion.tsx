import { FaqItem } from "@/lib/schema-org";
import { IconChevronDown } from "./icons";

// The `items` prop here must be the exact same array passed to
// faqPageSchema() on the page — architecture.md §6.3 requires visible
// content and JSON-LD to match exactly.
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <section aria-labelledby="faq-heading" className="mx-auto max-w-3xl px-4 py-16 md:py-20">
      <h2 id="faq-heading" className="text-2xl font-semibold text-slate-900 md:text-3xl">
        Vanliga frågor
      </h2>
      <div className="mt-8 space-y-3">
        {items.map((item, index) => (
          <details
            key={item.question}
            className="group rounded-lg border border-slate-200 bg-white open:border-blue-200 open:shadow-sm"
            open={index === 0}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium text-slate-900 marker:content-none">
              {item.question}
              <IconChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-180" />
            </summary>
            <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
