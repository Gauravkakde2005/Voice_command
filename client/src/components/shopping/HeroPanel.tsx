import { Languages, Mic, Sparkles } from "lucide-react";
import { Card } from "../common/Card";

export const HeroPanel = () => (
  <Card className="overflow-hidden bg-brand-ink text-white">
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div className="space-y-4">
        <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
          AI Voice Commerce
        </span>
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            Shop naturally with voice commands in English, Hindi, and Marathi.
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
            Capture speech, interpret intent with Gemini, organize products automatically, and uncover seasonal or
            substitute recommendations from your shopping habits.
          </p>
        </div>
      </div>
      <div className="grid gap-3">
        <div className="rounded-3xl bg-white/10 p-4">
          <Mic className="mb-3 h-5 w-5 text-brand-gold" />
          <p className="text-sm font-semibold">Voice-first list building</p>
          <p className="mt-1 text-xs text-slate-200">Add, update, remove, or search products hands-free.</p>
        </div>
        <div className="rounded-3xl bg-white/10 p-4">
          <Languages className="mb-3 h-5 w-5 text-brand-gold" />
          <p className="text-sm font-semibold">Multilingual understanding</p>
          <p className="mt-1 text-xs text-slate-200">Speech recognition tuned for `en-IN`, `hi-IN`, and `mr-IN`.</p>
        </div>
        <div className="rounded-3xl bg-white/10 p-4">
          <Sparkles className="mb-3 h-5 w-5 text-brand-gold" />
          <p className="text-sm font-semibold">Smart recommendations</p>
          <p className="mt-1 text-xs text-slate-200">Seasonal suggestions, substitutes, and category trends.</p>
        </div>
      </div>
    </div>
  </Card>
);
