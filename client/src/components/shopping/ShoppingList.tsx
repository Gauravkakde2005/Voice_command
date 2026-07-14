import { CalendarClock, Pencil, ShoppingBag, Square, SquareCheck, Star, Trash2 } from "lucide-react";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { Loader } from "../common/Loader";
import type { ShoppingItem } from "../../types/shopping";

interface ShoppingListProps {
  items: ShoppingItem[];
  loading: boolean;
  selectedItemIds: string[];
  onTogglePurchased: (item: ShoppingItem) => Promise<void>;
  onToggleFavorite: (item: ShoppingItem) => Promise<void>;
  onToggleSelectedItem: (id: string) => void;
  onSelectAllItems: () => void;
  onClearSelectedItems: () => void;
  onBulkDeleteSelectedItems: () => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const ShoppingList = ({
  items,
  loading,
  selectedItemIds,
  onTogglePurchased,
  onToggleFavorite,
  onToggleSelectedItem,
  onSelectAllItems,
  onClearSelectedItems,
  onBulkDeleteSelectedItems,
  onDelete
}: ShoppingListProps) => (
  <Card>
    <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-2">
        <ShoppingBag className="h-5 w-5 text-brand-coral" />
        <h2 className="font-display text-2xl font-bold">Shopping list</h2>
      </div>
      {!loading && items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" onClick={onSelectAllItems}>
            Select all
          </Button>
          <Button variant="ghost" onClick={onClearSelectedItems} disabled={selectedItemIds.length === 0}>
            Clear selection
          </Button>
          <Button variant="danger" onClick={() => void onBulkDeleteSelectedItems()} disabled={selectedItemIds.length === 0}>
            Delete selected ({selectedItemIds.length})
          </Button>
        </div>
      )}
    </div>
    {loading ? (
      <Loader label="Fetching your shopping items..." />
    ) : items.length === 0 ? (
      <p className="text-sm text-slate-500">No items found. Add one manually or via voice.</p>
    ) : (
      <div className="space-y-3">
        {items.map((item) => {
          const isSelected = selectedItemIds.includes(item._id);

          return (
            <div
              key={item._id}
              className={`flex flex-col gap-4 rounded-3xl border p-4 md:flex-row md:items-center md:justify-between ${
                isSelected ? "border-brand-coral/40 bg-brand-coral/5" : "border-slate-100 bg-slate-50/80"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  aria-label={`Select ${item.name}`}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-coral focus:ring-brand-coral"
                  checked={isSelected}
                  onChange={() => onToggleSelectedItem(item._id)}
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold capitalize">{item.name}</p>
                    <span className="rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-semibold text-brand-teal">
                      {item.category}
                    </span>
                    {item.favorite && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                        Favorite
                      </span>
                    )}
                    {item.brand && <span className="text-xs text-slate-500">{item.brand}</span>}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    Qty: {item.quantity} {item.price ? `• Rs. ${item.price}` : ""} {item.notes ? `• ${item.notes}` : ""}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                    {item.reminderAt && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                        <CalendarClock className="h-3.5 w-3.5" />
                        Reminder {new Date(item.reminderAt).toLocaleString()}
                      </span>
                    )}
                    <span className={`rounded-full px-3 py-1 ${item.purchased ? "bg-emerald-100 text-emerald-700" : "bg-slate-100"}`}>
                      {item.purchased ? "Purchased" : "Open"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant={item.favorite ? "secondary" : "ghost"} onClick={() => void onToggleFavorite(item)}>
                  <Star className="mr-2 h-4 w-4" fill={item.favorite ? "currentColor" : "none"} />
                  {item.favorite ? "Favorited" : "Favorite"}
                </Button>
                <Button variant={item.purchased ? "ghost" : "secondary"} onClick={() => void onTogglePurchased(item)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  {item.purchased ? "Purchased" : "Mark Purchased"}
                </Button>
                <Button variant="danger" onClick={() => void onDelete(item._id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </Card>
);
