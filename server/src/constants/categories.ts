export const DEFAULT_CATEGORIES = [
  "produce",
  "dairy",
  "bakery",
  "grains",
  "beverages",
  "snacks",
  "household",
  "personal-care",
  "frozen",
  "spices",
  "meat",
  "seafood",
  "other"
] as const;

export type ShoppingCategory = (typeof DEFAULT_CATEGORIES)[number];
