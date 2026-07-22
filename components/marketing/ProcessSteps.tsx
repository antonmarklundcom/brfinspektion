interface Step {
  title: string;
  description: string;
}

export function ProcessSteps({
  heading = "Så går det till",
  steps,
}: {
  heading?: string;
  steps: Step[];
}) {
  return (
    <section aria-labelledby="process-heading" className="bg-slate-50 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 id="process-heading" className="text-2xl font-semibold text-slate-900 md:text-3xl">
          {heading}
        </h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="relative rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-800 text-sm font-semibold text-white">
                {index + 1}
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-11 -right-3 hidden h-px w-6 border-t border-dashed border-slate-300 md:block"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
