import type { ShoppingCategory } from "../constants/categories.js";

export type CommandAction =
  | "add_item"
  | "update_item"
  | "remove_item"
  | "search_product"
  | "get_recommendations";

export interface ParsedVoiceCommand {
  action: CommandAction;
  item: string;
  quantity: number;
  category: ShoppingCategory;
  language: "en" | "hi" | "mr";
}

export interface ShoppingFilters {
  query?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
}
