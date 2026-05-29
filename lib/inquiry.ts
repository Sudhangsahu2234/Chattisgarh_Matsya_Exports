import { fishCatalog } from "@/lib/data";
import type { CartItem, InquiryInput, InquiryRecord } from "@/lib/types";

export type InquiryValidationResult =
  | { ok: true; value: InquiryInput }
  | { ok: false; errors: string[] };

const fishIds = new Set(fishCatalog.map((fish) => fish.id));

export function validateInquiry(input: unknown): InquiryValidationResult {
  const errors: string[] = [];
  const payload = input as Partial<InquiryInput>;

  if (!payload || typeof payload !== "object") {
    return { ok: false, errors: ["Invalid inquiry payload."] };
  }

  const buyerName = clean(payload.buyerName);
  const companyName = clean(payload.companyName);
  const phone = clean(payload.phone);
  const email = clean(payload.email);
  const destination = clean(payload.destination);
  const message = clean(payload.message);
  const items = Array.isArray(payload.items) ? payload.items : [];

  if (!buyerName) errors.push("Buyer name is required.");
  if (!phone && !email) errors.push("Provide at least one contact method.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Email address is invalid.");
  if (!destination) errors.push("Destination is required.");
  if (items.length === 0) errors.push("Add at least one fish to the inquiry.");

  const cleanedItems: CartItem[] = items.map((item, index) => {
    const fishId = clean(item?.fishId);
    const quantityKg = Number(item?.quantityKg);
    const packaging: CartItem["packaging"] = item?.packaging === "frozen" ? "frozen" : "chilled";

    if (!fishId || !fishIds.has(fishId)) errors.push(`Item ${index + 1} has an unknown fish.`);
    if (!Number.isFinite(quantityKg) || quantityKg < 1) errors.push(`Item ${index + 1} needs a quantity of at least 1 kg.`);

    return {
      fishId,
      quantityKg: Math.max(0, Math.round(quantityKg)),
      packaging
    };
  });

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      buyerName,
      companyName,
      phone,
      email,
      destination,
      message,
      items: cleanedItems
    }
  };
}

export function createInquiryRecord(input: InquiryInput): InquiryRecord {
  const now = new Date();
  const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();

  return {
    ...input,
    id: crypto.randomUUID(),
    reference: `CGF-${dateStamp}-${random}`,
    createdAt: now.toISOString(),
    status: "new"
  };
}

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}
