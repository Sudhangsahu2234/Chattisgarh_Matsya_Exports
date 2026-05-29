type PageHeroProps = {
  eyebrow: string;
  title: string;
  lead: string;
  tone?: "green" | "river" | "saffron";
};

export function PageHero({ eyebrow, title, lead, tone = "green" }: PageHeroProps) {
  return (
    <section className={`page-hero ${tone}`}>
      <div className="pattern-strip" aria-hidden="true" />
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{lead}</p>
    </section>
  );
}
