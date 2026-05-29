"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { fishCatalog } from "@/lib/data";

const fishById = new Map(fishCatalog.map((fish) => [fish.id, fish]));

export function OrderClient() {
  const router = useRouter();
  const { items, updateItem, removeItem, clearCart } = useCart();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const totalKg = useMemo(() => items.reduce((total, item) => total + item.quantityKg, 0), [items]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const payload = {
      buyerName: String(form.get("buyerName") ?? ""),
      companyName: String(form.get("companyName") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      destination: String(form.get("destination") ?? ""),
      message: String(form.get("message") ?? ""),
      items
    };

    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = (await response.json()) as { reference?: string; errors?: string[] };
    setSubmitting(false);

    if (!response.ok) {
      setError(result.errors?.join(" ") ?? "Could not submit the inquiry.");
      return;
    }

    clearCart();
    router.push(`/thank-you?ref=${encodeURIComponent(result.reference ?? "")}`);
  }

  return (
    <div className="order-layout">
      <section className="order-panel">
        <div className="section-heading compact">
          <p className="eyebrow">Order list</p>
          <h2>Selected fish</h2>
        </div>

        {items.length === 0 ? (
          <div className="empty-cart">
            <p>No fish selected yet.</p>
            <a href="/fish">Browse the catalog</a>
          </div>
        ) : (
          <>
            <div className="order-items">
              {items.map((item) => {
                const fish = fishById.get(item.fishId);
                if (!fish) return null;

                return (
                  <article key={item.fishId} className="order-item">
                    <img src={fish.image.url} alt="" />
                    <div>
                      <strong>{fish.englishName}</strong>
                      <span>{fish.localName}</span>
                      <label>
                        Quantity kg
                        <input
                          type="number"
                          min="1"
                          value={item.quantityKg}
                          onChange={(event) =>
                            updateItem(item.fishId, { quantityKg: Number(event.currentTarget.value) })
                          }
                        />
                      </label>
                      <label>
                        Packaging
                        <select
                          value={item.packaging}
                          onChange={(event) =>
                            updateItem(item.fishId, {
                              packaging: event.currentTarget.value === "frozen" ? "frozen" : "chilled"
                            })
                          }
                        >
                          <option value="chilled">Chilled 0-4°C</option>
                          <option value="frozen">Frozen -18°C</option>
                        </select>
                      </label>
                    </div>
                    <button type="button" onClick={() => removeItem(item.fishId)}>
                      Remove
                    </button>
                  </article>
                );
              })}
            </div>
            <p className="total-line">{totalKg.toLocaleString("en-IN")} kg in this inquiry</p>
          </>
        )}
      </section>

      <form className="inquiry-form" onSubmit={handleSubmit}>
        <div className="section-heading compact">
          <p className="eyebrow">Buyer details</p>
          <h2>Export inquiry</h2>
        </div>
        <div className="form-grid">
          <label>
            Buyer name
            <input name="buyerName" required placeholder="Full name" />
          </label>
          <label>
            Company
            <input name="companyName" placeholder="Trading company or buyer group" />
          </label>
          <label>
            Phone
            <input name="phone" placeholder="+91..." />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="buyer@example.com" />
          </label>
          <label className="full">
            Destination
            <input name="destination" required placeholder="City, state, country" />
          </label>
          <label className="full">
            Message
            <textarea name="message" rows={5} placeholder="Preferred delivery window, documents needed, or packing notes" />
          </label>
        </div>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="submit-button" type="submit" disabled={submitting || items.length === 0}>
          {submitting ? "Submitting..." : "Submit inquiry"}
        </button>
      </form>
    </div>
  );
}
