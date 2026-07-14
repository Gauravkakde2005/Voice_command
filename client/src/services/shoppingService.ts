import { api } from "./api";
import type { ItemFilters, ParsedVoiceCommand, RecommendationPayload, ShoppingItem } from "../types/shopping";

const buildQueryString = (filters: ItemFilters) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  return query ? `?${query}` : "";
};

export const shoppingService = {
  getItems: (filters: ItemFilters = {}) =>
    api.get<ShoppingItem[]>(`/items${buildQueryString(filters)}`),
  createItem: (payload: Partial<ShoppingItem>) => api.post<ShoppingItem>("/items", payload),
  updateItem: (id: string, payload: Partial<ShoppingItem>) => api.patch<ShoppingItem>(`/items/${id}`, payload),
  deleteItem: (id: string) => api.delete(`/items/${id}`),
  bulkDeleteItems: (ids: string[]) => api.post<{ deletedCount: number }>("/items/bulk-delete", { ids }),
  parseVoice: (text: string) => api.post<ParsedVoiceCommand>("/voice/parse", { text }),
  getRecommendations: () => api.get<RecommendationPayload>("/recommendations")
};
