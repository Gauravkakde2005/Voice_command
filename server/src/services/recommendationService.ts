import type { ShoppingItemDocument } from "../models/ShoppingItem.js";
import { detectCategory } from "../utils/categorizer.js";

const seasonalMap: Record<string, string[]> = {
  spring: ["mango", "cucumber", "mint"],
  summer: ["watermelon", "buttermilk", "ice cream"],
  monsoon: ["ginger tea", "corn", "soup"],
  autumn: ["apple", "oats", "peanut butter"],
  winter: ["dry fruits", "jaggery", "turmeric milk"]
};

const substituteMap: Record<string, string[]> = {
  milk: ["almond milk", "soy milk"],
  sugar: ["jaggery", "brown sugar"],
  butter: ["olive oil", "ghee"],
  rice: ["quinoa", "brown rice"]
};

const getIndianSeason = (): keyof typeof seasonalMap => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 4) return "spring";
  if (month >= 5 && month <= 6) return "summer";
  if (month >= 7 && month <= 9) return "monsoon";
  if (month >= 10 && month <= 11) return "autumn";
  return "winter";
};

export const buildRecommendations = (history: ShoppingItemDocument[]) => {
  const topCategories = [...history]
    .reduce<Map<string, number>>((acc, item) => {
      acc.set(item.category, (acc.get(item.category) ?? 0) + item.quantity);
      return acc;
    }, new Map())
    .entries();

  const frequentCategories = [...topCategories]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category]) => category);

  const seasonal = seasonalMap[getIndianSeason()].map((name) => ({
    name,
    category: detectCategory(name)
  }));

  const substitutes = history.flatMap((item) =>
    (substituteMap[item.name.toLowerCase()] ?? []).map((name) => ({
      original: item.name,
      substitute: name,
      category: detectCategory(name)
    }))
  );

  return {
    frequentCategories,
    seasonal,
    substitutes
  };
};
