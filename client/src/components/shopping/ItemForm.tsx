import { useState } from "react";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { categories } from "../../lib/constants";
import type { ShoppingItem } from "../../types/shopping";

interface ItemFormProps {
  onSubmit: (payload: Partial<ShoppingItem>) => Promise<void>;
}

const initialState: Partial<ShoppingItem> = {
  name: "",
  quantity: 1,
  category: "other",
  brand: "",
  price: undefined,
  notes: "",
  favorite: false,
  reminderAt: ""
};

export const ItemForm = ({ onSubmit }: ItemFormProps) => {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (key: keyof ShoppingItem, value: string | number | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
      setForm(initialState);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">Manual Add</p>
        <h2 className="mt-2 font-display text-2xl font-bold">Quick product entry</h2>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <Input
          placeholder="Item name"
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            type="number"
            min={1}
            placeholder="Quantity"
            value={form.quantity}
            onChange={(event) => updateField("quantity", Number(event.target.value))}
            required
          />
          <Select value={form.category} onChange={(event) => updateField("category", event.target.value)}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input placeholder="Brand" value={form.brand} onChange={(event) => updateField("brand", event.target.value)} />
          <Input
            type="number"
            min={0}
            step="0.01"
            placeholder="Price"
            value={form.price ?? ""}
            onChange={(event) => updateField("price", Number(event.target.value))}
          />
        </div>
        <Input placeholder="Notes" value={form.notes} onChange={(event) => updateField("notes", event.target.value)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-ink">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-brand-coral focus:ring-brand-coral"
              checked={Boolean(form.favorite)}
              onChange={(event) => updateField("favorite", event.target.checked)}
            />
            Favorite item
          </label>
          <Input
            type="datetime-local"
            value={form.reminderAt ?? ""}
            onChange={(event) => updateField("reminderAt", event.target.value)}
            placeholder="Reminder time"
          />
        </div>
        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? "Saving..." : "Add Shopping Item"}
        </Button>
      </form>
    </Card>
  );
};
