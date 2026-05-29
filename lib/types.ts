export type FishCategory = "commercial" | "local";

export type FishImage = {
  url: string;
  sourceUrl: string;
  credit: string;
  representative: boolean;
};

export type Fish = {
  id: string;
  index: number;
  category: FishCategory;
  localName: string;
  englishName: string;
  scientificName?: string;
  commercialValue: string;
  notes: string;
  image: FishImage;
};

export type Requirement = {
  requirement: string;
  specification: string;
};

export type LicenseCost = {
  license: string;
  authority: string;
  purpose: string;
  cost: string;
};

export type FisheriesParameter = {
  parameter: string;
  detail: string;
};

export type CartItem = {
  fishId: string;
  quantityKg: number;
  packaging: "chilled" | "frozen";
};

export type InquiryInput = {
  buyerName: string;
  companyName?: string;
  phone?: string;
  email?: string;
  destination: string;
  message?: string;
  items: CartItem[];
};

export type InquiryRecord = InquiryInput & {
  id: string;
  reference: string;
  createdAt: string;
  status: "new";
};
