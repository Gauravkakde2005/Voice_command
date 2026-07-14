import { useEffect, useState } from "react";
import { toast } from "sonner";
import { shoppingService } from "../services/shoppingService";
import type { ItemFilters, ParsedVoiceCommand, RecommendationPayload, ShoppingItem } from "../types/shopping";

export const useShoppingAssistant = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [filters, setFilters] = useState<ItemFilters>({});

  const fetchItems = async (nextFilters: ItemFilters = filters) => {
    setLoading(true);
    try {
      const data = await shoppingService.getItems(nextFilters);
      setItems(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to fetch items.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const data = await shoppingService.getRecommendations();
      setRecommendations(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to fetch recommendations.");
    }
  };

  useEffect(() => {
    void fetchItems({});
    void fetchRecommendations();
  }, []);

  const createItem = async (payload: Partial<ShoppingItem>) => {
    await shoppingService.createItem(payload);
    toast.success("Item added to your shopping list.");
    await fetchItems();
  };

  const updateItem = async (id: string, payload: Partial<ShoppingItem>) => {
    await shoppingService.updateItem(id, payload);
    toast.success("Shopping item updated.");
    await fetchItems();
  };

  const deleteItem = async (id: string) => {
    await shoppingService.deleteItem(id);
    toast.success("Shopping item removed.");
    await fetchItems();
  };

  const bulkDeleteItems = async (ids: string[]) => {
    const { deletedCount } = await shoppingService.bulkDeleteItems(ids);
    toast.success(`Removed ${deletedCount} shopping item${deletedCount === 1 ? "" : "s"}.`);
    await fetchItems();
  };

  const applyFilters = async (nextFilters: ItemFilters) => {
    setFilters(nextFilters);
    await fetchItems(nextFilters);
  };

  const handleVoiceCommand = async (transcript: string) => {
    setVoiceLoading(true);

    try {
      const command = await shoppingService.parseVoice(transcript);

      if (command.action === "add_item") {
        await shoppingService.createItem({
          name: command.item,
          quantity: command.quantity,
          category: command.category
        });
        await fetchItems();
      }

      if (command.action === "update_item" || command.action === "remove_item") {
        const existing = items.find((item) => item.name.toLowerCase() === command.item.toLowerCase());

        if (!existing) {
          throw new Error(`No existing item found for "${command.item}".`);
        }

        if (command.action === "update_item") {
          await shoppingService.updateItem(existing._id, { quantity: command.quantity, category: command.category });
        }

        if (command.action === "remove_item") {
          await shoppingService.deleteItem(existing._id);
        }

        await fetchItems();
      }

      if (command.action === "search_product") {
        const nextFilters = { ...filters, query: command.item };
        setFilters(nextFilters);
        await fetchItems(nextFilters);
      }

      if (command.action === "get_recommendations") {
        await fetchRecommendations();
      }

      toast.success(`Voice command processed: ${command.action.replace("_", " ")}`);
      await fetchRecommendations();
      return command;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to process the voice command.";
      toast.error(message);
      throw error;
    } finally {
      setVoiceLoading(false);
    }
  };

  return {
    items,
    recommendations,
    loading,
    voiceLoading,
    filters,
    createItem,
    updateItem,
    deleteItem,
    bulkDeleteItems,
    applyFilters,
    handleVoiceCommand
  };
};
