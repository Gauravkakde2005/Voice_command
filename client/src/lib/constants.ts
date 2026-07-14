import type { Category } from "../types/shopping";

export const categories: Category[] = [
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
];

export const languageOptions = [
  { label: "English", value: "en-IN" },
  { label: "Hindi", value: "hi-IN" },
  { label: "Marathi", value: "mr-IN" }
] as const;
