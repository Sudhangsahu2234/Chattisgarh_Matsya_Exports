import { OrderClient } from "@/components/OrderClient";
import { PageHero } from "@/components/PageHero";

export default function OrderPage() {
  return (
    <>
      <PageHero
        eyebrow="Buyer inquiry"
        title="Order fish for export discussion"
        lead="Select fish from the catalog, confirm quantity and packaging, then submit a database-ready export inquiry."
        tone="river"
      />
      <section className="section-wrap">
        <OrderClient />
      </section>
    </>
  );
}
