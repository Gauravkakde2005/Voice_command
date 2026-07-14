export type Category =
  | "produce"
  | "dairy"
  | "bakery"
  | "grains"
  | "beverages"
  | "snacks"
  | "household"
  | "personal-care"
  | "frozen"
  | "spices"
  | "meat"
  | "seafood"
  | "other";

export type CommandAction =
  | "add_item"
  | "update_item"
  | "remove_item"
  | "search_product"
  | "get_recommendations";

export interface ShoppingItem {
  _id: string;
  name: string;
  quantity: number;
  category: Category;
  brand?: string;
  price?: number;
  notes?: string;
  favorite: boolean;
  reminderAt?: string;
  purchased: boolean;
  lastPurchasedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedVoiceCommand {
  action: CommandAction;
  item: string;
  quantity: number;
  category: Category;
  language: "en" | "hi" | "mr";
}

export interface RecommendationPayload {
  frequentCategories: string[];
  seasonal: Array<{ name: string; category: Category }>;
  substitutes: Array<{ original: string; substitute: string; category: Category }>;
}

export interface ItemFilters {
  query?: string;
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}
