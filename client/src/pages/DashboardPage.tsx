import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "../components/layout/AppShell";
import { HeroPanel } from "../components/shopping/HeroPanel";
import { VoiceCommandPanel } from "../components/shopping/VoiceCommandPanel";
import { ItemForm } from "../components/shopping/ItemForm";
import { SearchFilters } from "../components/shopping/SearchFilters";
import { ShoppingList } from "../components/shopping/ShoppingList";
import { RecommendationsPanel } from "../components/shopping/RecommendationsPanel";
import { useShoppingAssistant } from "../hooks/useShoppingAssistant";
import { useVoiceRecognition } from "../hooks/useVoiceRecognition";
import type { ParsedVoiceCommand, ShoppingItem } from "../types/shopping";

export const DashboardPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en-IN");
  const [transcript, setTranscript] = useState("");
  const [lastCommand, setLastCommand] = useState<ParsedVoiceCommand | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  const {
    items,
    recommendations,
    loading,
    voiceLoading,
    createItem,
    updateItem,
    deleteItem,
    bulkDeleteItems,
    applyFilters,
    handleVoiceCommand
  } =
    useShoppingAssistant();

  useEffect(() => {
    setSelectedItemIds((current) => current.filter((id) => items.some((item) => item._id === id)));
  }, [items]);

  const voice = useVoiceRecognition({
    language: selectedLanguage,
    onTranscript: (nextTranscript) => {
      setTranscript(nextTranscript);
      void handleVoiceCommand(nextTranscript)
        .then((command) => setLastCommand(command))
        .catch(() => {
          toast.error("Voice command processing failed.");
        });
    }
  });

  const togglePurchased = async (item: ShoppingItem) => {
    await updateItem(item._id, {
      purchased: !item.purchased,
      lastPurchasedAt: new Date().toISOString()
    });
  };

  const toggleFavorite = async (item: ShoppingItem) => {
    await updateItem(item._id, { favorite: !item.favorite });
  };

  const toggleSelectedItem = (id: string) => {
    setSelectedItemIds((current) =>
      current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id]
    );
  };

  const selectAllItems = () => {
    setSelectedItemIds(items.map((item) => item._id));
  };

  const clearSelectedItems = () => {
    setSelectedItemIds([]);
  };

  const bulkDeleteSelectedItems = async () => {
    if (selectedItemIds.length === 0) {
      return;
    }

    await bulkDeleteItems(selectedItemIds);
    setSelectedItemIds([]);
  };

  return (
    <AppShell>
      <div className="grid gap-6">
        <div className="sticky top-6 z-50"> 
          <ShoppingList
            items={items}
            loading={loading}
            selectedItemIds={selectedItemIds}
            onTogglePurchased={togglePurchased}
            onToggleFavorite={toggleFavorite}
            onToggleSelectedItem={toggleSelectedItem}
            onSelectAllItems={selectAllItems}
            onClearSelectedItems={clearSelectedItems}
            onBulkDeleteSelectedItems={bulkDeleteSelectedItems}
            onDelete={deleteItem}
          />
        </div>
        <HeroPanel />
        <VoiceCommandPanel
          selectedLanguage={selectedLanguage}
          transcript={transcript}
          command={lastCommand}
          isListening={voice.isListening}
          isSupported={voice.isSupported}
          voiceLoading={voiceLoading}
          onLanguageChange={setSelectedLanguage}
          onStart={voice.startListening}
          onStop={voice.stopListening}
        />
        <SearchFilters onApply={applyFilters} />
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="grid gap-6">
            <ItemForm onSubmit={createItem} />
          </div>
          <RecommendationsPanel recommendations={recommendations} />
        </div>
      </div>
    </AppShell>
  );
};
