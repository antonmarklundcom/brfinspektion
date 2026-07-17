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
    <section aria-labelledby="process-heading" className="mx-auto max-w-6xl px-4 py-16">
      <h2 id="process-heading" className="text-2xl font-semibold text-slate-900">
        {heading}
      </h2>
      <ol className="mt-8 grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-lg border border-slate-200 p-5">
            <span className="text-sm font-semibold text-blue-800">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-2 font-semibold text-slate-900">{step.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
