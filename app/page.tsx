import Link from "next/link";
import { commercialFish, exportRequirements, featuredStats, fisheriesParameters } from "@/lib/data";

export default function Home() {
  return (
    <>
      <section className="home-hero">
        <img
          src="https://commons.wikimedia.org/wiki/Special:FilePath/Aeration%20systems%20in%20an%20Aqua%20pond%20near%20Eluru.jpg?width=1800"
          alt=""
          className="hero-bg"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">छत्तीसगढ़ का मत्स्य व्यापार</p>
          <h1>Chhattisgarh Fish Exports</h1>
          <p>
            A traditional, data-led export desk for commercial carps, local fish names, transport standards,
            licenses, and buyer inquiries from the freshwater heart of India.
          </p>
          <div className="hero-actions">
            <Link href="/fish">Explore fish</Link>
            <Link href="/order">Start inquiry</Link>
          </div>
        </div>
      </section>

      <section className="stats-band">
        {featuredStats.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="craft-band">
        <div>
          <p className="eyebrow">Bastar craft inspired</p>
          <h2>Forest color, river utility, and handworked detail</h2>
          <p>
            The interface takes cues from Bastar Dhokra bell-metal craft, Godna linework, weekly haat trading,
            and Chhattisgarh river systems. The result is practical for exporters while still feeling rooted in place.
          </p>
        </div>
        <div className="motif-panel" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </section>

      <section className="section-wrap">
        <div className="section-heading">
          <p className="eyebrow">Commercial list</p>
          <h2>Export-ready fish names</h2>
          <Link href="/fish">View complete catalog</Link>
        </div>
        <div className="feature-grid">
          {commercialFish.slice(0, 3).map((fish) => (
            <article key={fish.id} className="feature-card">
              <img src={fish.image.url} alt={`${fish.englishName} fish`} />
              <div>
                <span>{fish.localName}</span>
                <h3>{fish.englishName}</h3>
                <p>{fish.commercialValue}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="split-band">
        <div>
          <p className="eyebrow">Transport essentials</p>
          <h2>Cold-chain details from the CSV</h2>
          <div className="mini-list">
            {exportRequirements.slice(0, 3).map((item) => (
              <p key={item.requirement}>
                <strong>{item.requirement}</strong>
                <span>{item.specification}</span>
              </p>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow">State capacity</p>
          <h2>Chhattisgarh fisheries facts</h2>
          <div className="mini-list">
            {fisheriesParameters.slice(0, 3).map((item) => (
              <p key={item.parameter}>
                <strong>{item.parameter}</strong>
                <span>{item.detail}</span>
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
