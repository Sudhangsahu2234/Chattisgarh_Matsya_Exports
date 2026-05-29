import { PageHero } from "@/components/PageHero";
import { exportRequirements } from "@/lib/data";

export default function ExportGuidePage() {
  return (
    <>
      <PageHero
        eyebrow="Export movement"
        title="Cold-chain and transport guide"
        lead="Temperature, FSSAI, vehicle, and certificate requirements for moving fish safely across state and export channels."
        tone="river"
      />
      <section className="section-wrap">
        <div className="guide-grid">
          {exportRequirements.map((item, index) => (
            <article key={item.requirement} className="guide-card">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{item.requirement}</h2>
              <p>{item.specification}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="split-band">
        <div>
          <p className="eyebrow">Chilled</p>
          <h2>0-4°C movement</h2>
          <p>
            Use insulated refrigerated vehicles, faster dispatch windows, and clean packing surfaces for fresh fish
            headed to interstate buyers.
          </p>
        </div>
        <div>
          <p className="eyebrow">Frozen</p>
          <h2>-18°C or colder</h2>
          <p>
            Frozen orders should be packed for colder holding, longer transit, and documentation checks before dispatch.
          </p>
        </div>
      </section>
    </>
  );
}
