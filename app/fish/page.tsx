import { FishCard } from "@/components/FishCard";
import { PageHero } from "@/components/PageHero";
import { commercialFish, localFish } from "@/lib/data";

export default function FishPage() {
  return (
    <>
      <PageHero
        eyebrow="मछली सूची"
        title="Fish catalog"
        lead="Commercial species and indigenous Chhattisgarh local names from the CSV, with source-linked internet photography."
      />

      <section className="section-wrap">
        <div className="section-heading">
          <p className="eyebrow">Commercial species</p>
          <h2>High-demand export list</h2>
        </div>
        <div className="fish-grid">
          {commercialFish.map((fish) => (
            <FishCard key={fish.id} fish={fish} />
          ))}
        </div>
      </section>

      <section className="section-wrap muted-section">
        <div className="section-heading">
          <p className="eyebrow">Local names</p>
          <h2>Indigenous Chhattisgarh list</h2>
        </div>
        <div className="fish-grid compact-grid">
          {localFish.map((fish) => (
            <FishCard key={fish.id} fish={fish} />
          ))}
        </div>
      </section>
    </>
  );
}
