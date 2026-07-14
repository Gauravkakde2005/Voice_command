import { CalendarRange, RefreshCcw, Shapes } from "lucide-react";
import { Card } from "../common/Card";
import type { RecommendationPayload } from "../../types/shopping";

interface RecommendationsPanelProps {
  recommendations: RecommendationPayload | null;
}

export const RecommendationsPanel = ({ recommendations }: RecommendationsPanelProps) => (
  <Card className="h-full">
    <div className="mb-5">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">AI Recommendations</p>
      <h2 className="mt-2 font-display text-2xl font-bold">History-aware shopping nudges</h2>
    </div>

    {recommendations ? (
      <div className="grid gap-4">
        <div className="rounded-3xl bg-brand-coral/10 p-4">
          <div className="flex items-center gap-2">
            <Shapes className="h-5 w-5 text-brand-coral" />
            <p className="font-semibold">Frequent categories</p>
          </div>
          <p className="mt-3 text-sm text-slate-700">{recommendations.frequentCategories.join(", ") || "No purchase history yet."}</p>
        </div>

        <div className="rounded-3xl bg-brand-teal/10 p-4">
          <div className="flex items-center gap-2">
            <CalendarRange className="h-5 w-5 text-brand-teal" />
            <p className="font-semibold">Seasonal picks</p>
          </div>
          <p className="mt-3 text-sm text-slate-700">
            {recommendations.seasonal.map((item) => `${item.name} (${item.category})`).join(", ")}
          </p>
        </div>

        <div className="rounded-3xl bg-brand-gold/20 p-4">
          <div className="flex items-center gap-2">
            <RefreshCcw className="h-5 w-5 text-brand-ink" />
            <p className="font-semibold">Suggested substitutes</p>
          </div>
          <p className="mt-3 text-sm text-slate-700">
            {recommendations.substitutes.length > 0
              ? recommendations.substitutes.map((item) => `${item.original} -> ${item.substitute}`).join(", ")
              : "Substitutes will appear after you build some purchase history."}
          </p>
        </div>
      </div>
    ) : (
      <p className="text-sm text-slate-500">Recommendations will appear after loading your shopping history.</p>
    )}
  </Card>
);
