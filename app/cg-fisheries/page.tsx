import { PageHero } from "@/components/PageHero";
import { fisheriesParameters } from "@/lib/data";

export default function CgFisheriesPage() {
  return (
    <>
      <PageHero
        eyebrow="State fisheries"
        title="Chhattisgarh aquaculture data"
        lead="Fish seed production, PMMSY investment, cultured species, hatchery progress, and cage farming capacity."
      />
      <section className="section-wrap">
        <div className="fisheries-grid">
          {fisheriesParameters.map((item) => (
            <article className="fisheries-card" key={item.parameter}>
              <span>{item.parameter}</span>
              <h2>{item.detail}</h2>
            </article>
          ))}
        </div>
      </section>
      <section className="river-band">
        <p className="eyebrow">River systems</p>
        <h2>Mahanadi, Sheonath, Hasdo, and Indravati shape the freshwater economy.</h2>
        <p>
          The site positions Chhattisgarh as a freshwater-origin export region, connecting production facts with
          license readiness and buyer inquiry workflows.
        </p>
      </section>
    </>
  );
}
