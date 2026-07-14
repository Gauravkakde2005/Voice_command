import { Search } from "lucide-react";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { categories } from "../../lib/constants";
import type { ItemFilters } from "../../types/shopping";
import { useState } from "react";

interface SearchFiltersProps {
  onApply: (filters: ItemFilters) => Promise<void>;
}

export const SearchFilters = ({ onApply }: SearchFiltersProps) => {
  const [filters, setFilters] = useState<ItemFilters>({});

  const updateField = (key: keyof ItemFilters, value: string) => {
    setFilters((current) => ({
      ...current,
      [key]: value === "" ? undefined : key.includes("Price") ? Number(value) : value
    }));
  };

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <Search className="h-5 w-5 text-brand-coral" />
        <h2 className="font-display text-2xl font-bold">Search by product, brand, category, or budget</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Input placeholder="Search products" onChange={(event) => updateField("query", event.target.value)} />
        <Input placeholder="Brand" onChange={(event) => updateField("brand", event.target.value)} />
        <Select defaultValue="" onChange={(event) => updateField("category", event.target.value)}>
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
        <Input type="number" min={0} placeholder="Min price" onChange={(event) => updateField("minPrice", event.target.value)} />
        <div className="flex gap-3">
          <Input
            type="number"
            min={0}
            placeholder="Max price"
            onChange={(event) => updateField("maxPrice", event.target.value)}
          />
          <Button variant="secondary" onClick={() => void onApply(filters)}>
            Apply
          </Button>
        </div>
      </div>
    </Card>
  );
};
