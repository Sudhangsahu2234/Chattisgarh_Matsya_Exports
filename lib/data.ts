import type { Fish, FisheriesParameter, LicenseCost, Requirement } from "@/lib/types";

const imageSources = {
  rohu: {
    url: "https://commons.wikimedia.org/wiki/Special:FilePath/Rohu%20%28Labeo%20rohita%29.jpg?width=1200",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Rohu_(Labeo_rohita).jpg",
    credit: "Wikimedia Commons / Salil Kumar Mukherjee",
    representative: false
  },
  catla: {
    url: "https://commons.wikimedia.org/wiki/Special:FilePath/Catla%20catla.jpg?width=1200",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Catla_catla.jpg",
    credit: "Wikimedia Commons",
    representative: false
  },
  mrigal: {
    url: "https://commons.wikimedia.org/wiki/Special:FilePath/Mrigel%20fish.jpg?width=1200",
    sourceUrl: "https://commons.wikimedia.org/wiki/Category:Cirrhinus",
    credit: "Wikimedia Commons",
    representative: false
  },
  eel: {
    url: "https://commons.wikimedia.org/wiki/Special:FilePath/Anguilla%20bengalensis%20bengalensis.jpg?width=1200",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Anguilla_bengalensis_bengalensis.jpg",
    credit: "Wikimedia Commons / Nandini Velho",
    representative: true
  },
  market: {
    url: "https://commons.wikimedia.org/wiki/Special:FilePath/Fish%20Market%20Uzan%20Bazar%20India.jpg?width=1200",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Fish_Market_Uzan_Bazar_India.jpg",
    credit: "Wikimedia Commons / Donvikro",
    representative: true
  },
  catlaMarket: {
    url: "https://commons.wikimedia.org/wiki/Special:FilePath/Catla%20fish%20displayed%20for%20sale%20at%20Boiddar%20Bazar%2C%20Sonargaon.jpg?width=1200",
    sourceUrl: "https://commons.wikimedia.org/wiki/Category:Catla_catla",
    credit: "Wikimedia Commons",
    representative: true
  },
  shivajiMarket: {
    url: "https://commons.wikimedia.org/wiki/Special:FilePath/Fish%20on%20sale%20at%20Shivaji%20Market%2C%20Pune%20Camp.jpg?width=1200",
    sourceUrl: "https://commons.wikimedia.org/wiki/Category:Fishmongers_in_India",
    credit: "Wikimedia Commons",
    representative: true
  }
} satisfies Record<string, Fish["image"]>;

export const commercialFish: Fish[] = [
  {
    id: "rohu",
    index: 1,
    category: "commercial",
    localName: "रोहू",
    englishName: "Rohu",
    scientificName: "Labeo rohita",
    commercialValue: "Very High (most abundant: 6.182%) - journalbioscience",
    notes: "Flagship Indian major carp for freshwater trade, pond culture, and interstate chilled supply.",
    image: imageSources.rohu
  },
  {
    id: "catla",
    index: 2,
    category: "commercial",
    localName: "कतला",
    englishName: "Catla",
    scientificName: "Catla catla",
    commercialValue: "Very High",
    notes: "High-demand carp with strong domestic market recognition and export-ready volume potential.",
    image: imageSources.catla
  },
  {
    id: "mirgal",
    index: 3,
    category: "commercial",
    localName: "मिरगल",
    englishName: "Mirgal",
    scientificName: "Cirrhinus mrigala",
    commercialValue: "High",
    notes: "Important Indian major carp used in polyculture systems across ponds and reservoirs.",
    image: imageSources.mrigal
  },
  {
    id: "ghaskaat",
    index: 4,
    category: "commercial",
    localName: "घांस काट",
    englishName: "Ghaskaat",
    commercialValue: "Medium",
    notes: "Local commercial listing from the CSV. Image is representative because the scientific name was not provided.",
    image: imageSources.catlaMarket
  },
  {
    id: "padhina",
    index: 5,
    category: "commercial",
    localName: "पड़हिना",
    englishName: "Padhina",
    commercialValue: "Medium",
    notes: "Regional trade name from the source list. Confirm exact species before final export documentation.",
    image: imageSources.market
  },
  {
    id: "bam",
    index: 6,
    category: "commercial",
    localName: "बाम",
    englishName: "Bam (Freshwater Eel)",
    commercialValue: "Medium",
    notes: "Eel-type listing with representative Indian mottled eel photography for visual guidance.",
    image: imageSources.eel
  },
  {
    id: "kari",
    index: 7,
    category: "commercial",
    localName: "कारी",
    englishName: "Curry",
    commercialValue: "Medium",
    notes: "Local market name from the CSV. Image is representative until scientific identification is confirmed.",
    image: imageSources.shivajiMarket
  }
];

const localNames = [
  ["कोतरी", "Kothari"],
  ["डडवा", "Dadva"],
  ["बामी", "Bami"],
  ["सारंगी", "Sarangi"],
  ["टेंगना", "Thengana"],
  ["चिल्हाटी", "Chilhati"],
  ["लुदुवा", "Ludva"],
  ["डेसरा", "Dasra"],
  ["खोखसी", "Khoksi"],
  ["भेदों", "Bhedon"],
  ["सोडहा", "Sohada"],
  ["गीवना", "Givena"],
  ["केवई", "Kevai"],
  ["मोंगरी", "Mongri"],
  ["चिंगारी", "Chingari"],
  ["तेलपिवा", "Tellpiva"]
] as const;

const representativeImages = [
  imageSources.market,
  imageSources.catlaMarket,
  imageSources.shivajiMarket,
  imageSources.rohu,
  imageSources.catla,
  imageSources.mrigal
];

export const localFish: Fish[] = localNames.map(([localName, englishName], index) => ({
  id: englishName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  index: index + 1,
  category: "local",
  localName,
  englishName,
  commercialValue: "Local heritage species",
  notes: "Indigenous Chhattisgarh market name from the CSV. Photo is representative pending exact scientific validation.",
  image: {
    ...representativeImages[index % representativeImages.length],
    representative: true
  }
}));

export const fishCatalog = [...commercialFish, ...localFish];

export const exportRequirements: Requirement[] = [
  {
    requirement: "Chilled fish temperature",
    specification: "0-4°C - rinac"
  },
  {
    requirement: "Frozen fish temperature",
    specification: "-18°C or colder - rinac"
  },
  {
    requirement: "FSSAI certificate",
    specification: "Mandatory when transporting fish across states - fssai.gov"
  },
  {
    requirement: "Vehicle requirements",
    specification: "Properly insulated, refrigerated transport - fssai.gov"
  },
  {
    requirement: "Transport license",
    specification: "Required for vehicle and hygiene certification - fssai.gov"
  },
  {
    requirement: "Fee for transport certificate",
    specification: "₹2,000 - fssai.gov"
  }
];

export const licenseCosts: LicenseCost[] = [
  {
    license: "IEC Code",
    authority: "DGFT",
    purpose: "Import/Export Code (mandatory)",
    cost: "₹500"
  },
  {
    license: "APEDA RCMC",
    authority: "APEDA",
    purpose: "Registration-Cum-Membership Certificate for scheduled products",
    cost: "₹5,000 - cleartax"
  },
  {
    license: "FSSAI Central License",
    authority: "FSSAI",
    purpose: "Food safety for exporters, mandatory irrespective of turnover",
    cost: "Variable - cleartax"
  },
  {
    license: "CRES Certificate",
    authority: "Fisheries Dept",
    purpose: "Color & Refrigeration Export Standards",
    cost: "-"
  },
  {
    license: "Certificate of Origin",
    authority: "Chamber of Commerce",
    purpose: "Proves Indian origin",
    cost: "-"
  }
];

export const fisheriesParameters: FisheriesParameter[] = [
  {
    parameter: "Fish seed production",
    detail: "28 million annually (5th in India) - slideshare"
  },
  {
    parameter: "PMMSY investment",
    detail: "₹923.39 Cr with 29 unique initiatives - facebook"
  },
  {
    parameter: "Major cultured species",
    detail: "Indian major carps and exotic carps - slideshare"
  },
  {
    parameter: "First Pangasius hatchery",
    detail: "Established in Chhattisgarh as a national first - agriportal.cg"
  },
  {
    parameter: "Cage farming",
    detail: "56,643 units approved under PMMSY - pib"
  }
];

export const featuredStats = [
  { value: "23", label: "listed fish names" },
  { value: "7", label: "commercial species" },
  { value: "16", label: "local CG names" },
  { value: "₹923.39 Cr", label: "PMMSY investment" }
];
