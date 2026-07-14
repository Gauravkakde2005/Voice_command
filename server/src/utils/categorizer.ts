import { DEFAULT_CATEGORIES, type ShoppingCategory } from "../constants/categories.js";

const categoryKeywords: Record<ShoppingCategory, string[]> = {
  produce: ["apple", "banana", "onion", "tomato", "potato", "fruit", "vegetable", "spinach"],
  dairy: ["milk", "curd", "cheese", "butter", "paneer", "yogurt"],
  bakery: ["bread", "bun", "cake", "cookie", "toast"],
  grains: ["rice", "wheat", "flour", "atta", "dal", "lentil", "pasta"],
  beverages: ["juice", "tea", "coffee", "soda", "water"],
  snacks: ["chips", "namkeen", "biscuit", "chocolate"],
  household: ["detergent", "soap", "cleaner", "tissue"],
  "personal-care": ["shampoo", "toothpaste", "face wash", "conditioner"],
  frozen: ["ice cream", "frozen peas", "frozen"],
  spices: ["salt", "pepper", "masala", "turmeric", "chili"],
  meat: ["chicken", "mutton", "egg"],
  seafood: ["fish", "prawn"],
  other: []
};

export const detectCategory = (itemName: string): ShoppingCategory => {
  const normalized = itemName.toLowerCase();

  for (const category of DEFAULT_CATEGORIES) {
    if (categoryKeywords[category].some((keyword) => normalized.includes(keyword))) {
      return category;
    }
  }

  return "other";
};
