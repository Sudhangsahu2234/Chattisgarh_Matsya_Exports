import { PageHero } from "@/components/PageHero";
import { licenseCosts } from "@/lib/data";

export default function LicensesPage() {
  return (
    <>
      <PageHero
        eyebrow="Compliance desk"
        title="Licenses, authority, purpose, and cost"
        lead="A practical view of the documents listed in the CSV for fish exporters and transporters."
        tone="saffron"
      />
      <section className="section-wrap">
        <div className="license-table" role="table" aria-label="License cost table">
          <div className="table-row table-head" role="row">
            <span>License</span>
            <span>Authority</span>
            <span>Purpose</span>
            <span>Cost</span>
          </div>
          {licenseCosts.map((item) => (
            <div className="table-row" role="row" key={item.license}>
              <span>{item.license}</span>
              <span>{item.authority}</span>
              <span>{item.purpose}</span>
              <span>{item.cost}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
