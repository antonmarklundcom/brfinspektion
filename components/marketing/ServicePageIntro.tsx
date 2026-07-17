export function ServicePageIntro({
  title,
  intro,
}: {
  title: string;
  intro: string;
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-4 text-lg text-slate-600">{intro}</p>
    </section>
  );
}
