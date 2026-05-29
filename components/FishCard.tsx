"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import type { Fish } from "@/lib/types";

export function FishCard({ fish }: { fish: Fish }) {
  const { addFish } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addFish(fish);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="fish-card">
      <div className="fish-image">
        <img src={fish.image.url} alt={`${fish.englishName} fish`} loading="lazy" />
        {fish.image.representative ? <span>Representative image</span> : null}
      </div>
      <div className="fish-card-body">
        <p className="fish-local">{fish.localName}</p>
        <h3>{fish.englishName}</h3>
        <p className="scientific">{fish.scientificName ?? "Scientific name to be confirmed"}</p>
        <p className="value-pill">{fish.commercialValue}</p>
        <p>{fish.notes}</p>
        <a href={fish.image.sourceUrl} target="_blank" rel="noreferrer" className="source-link">
          Photo: {fish.image.credit}
        </a>
        <button type="button" className={added ? "add-button added" : "add-button"} onClick={handleAdd}>
          {added ? "Added to inquiry" : "Add to order"}
        </button>
      </div>
    </article>
  );
}
