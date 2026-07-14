import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { env } from "../config/env.js";
import { DEFAULT_CATEGORIES } from "../constants/categories.js";
import { AppError } from "../utils/appError.js";
import type { ParsedVoiceCommand } from "../types/shopping.js";
import { detectCategory } from "../utils/categorizer.js";

const parsedVoiceCommandSchema = z.object({
  action: z.enum(["add_item", "update_item", "remove_item", "search_product", "get_recommendations"]),
  item: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
  category: z.enum(DEFAULT_CATEGORIES),
  language: z.enum(["en", "hi", "mr"]).default("en")
});

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export const parseVoiceCommand = async (input: string): Promise<ParsedVoiceCommand> => {
  try {
    const model = genAI.getGenerativeModel({
      model: env.GEMINI_MODEL,
      generationConfig: {
        responseMimeType: "application/json"
      }
    });
    const prompt = `
You are a shopping voice assistant parser.
Return only valid JSON with keys: action, item, quantity, category, language.
Supported languages: English (en), Hindi (hi), Marathi (mr).
Use one of these categories exactly: ${DEFAULT_CATEGORIES.join(", ")}.
Actions allowed: add_item, update_item, remove_item, search_product, get_recommendations.
If category is unclear, infer the closest category.
User input: "${input}"
    `.trim();

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const normalized = text.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(normalized) as ParsedVoiceCommand;

    return parsedVoiceCommandSchema.parse({
      ...parsed,
      category: parsed.category || detectCategory(parsed.item)
    });
  } catch (error) {
    // If we're in development, fall back to a lightweight local parser instead
    // of returning a 502. This makes local dev resilient when the external
    // Gemini API is unavailable or returns invalid JSON.
    if (env.NODE_ENV === "development") {
      try {
        const fallback = fallbackParse(input);
        return parsedVoiceCommandSchema.parse({
          ...fallback,
          category: fallback.category || detectCategory(fallback.item)
        });
      } catch (e) {
        // fall through to throw below
      }
    }

    if (error instanceof SyntaxError) {
      throw new AppError("Gemini returned invalid JSON for the voice command.", 502);
    }

    const message = error instanceof Error ? error.message : "Unable to process the voice command with Gemini.";
    throw new AppError(message, 502);
  }
};

// Lightweight local parser used only in development when Gemini is not available.
function fallbackParse(input: string): ParsedVoiceCommand {
  const text = input.trim().toLowerCase();

  const numberWords: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10
  };

  // determine action
  let action: ParsedVoiceCommand["action"] = "add_item";
  if (/remove|delete|take out|remove from/.test(text)) action = "remove_item";
  else if (/update|change|set|replace|increase|decrease/.test(text)) action = "update_item";
  else if (/search|find|look for/.test(text)) action = "search_product";
  else if (/recommend|suggest/.test(text)) action = "get_recommendations";

  // quantity
  let quantityMatch = text.match(/(\d+)\s+(?:x\s*)?([a-zA-Z]+)/);
  let quantity = 1;
  let item = "";

  if (quantityMatch) {
    quantity = Number(quantityMatch[1]) || 1;
    item = quantityMatch[2];
  } else {
    // try number words
    const nw = Object.keys(numberWords).find((w) => text.includes(` ${w} `) || text.startsWith(`${w} `));
    if (nw) quantity = numberWords[nw];

    // try to extract item after action keyword
    const afterAction = text.replace(/^(please\s+)?(hey\s+)?(add|put|buy|i want to buy|i want|i need to|remove|delete|update|search|find|recommend|suggest)\s*/, "");
    const words = afterAction.split(/\s+/).filter(Boolean);
    if (words.length) {
      // prefer last noun-like token(s)
      item = words.slice(0, 3).join(" ");
    }
  }

  // normalize item by trimming punctuation
  item = item.replace(/[^a-z\s]/g, "").trim() || "item";

  // try to infer category
  const category = detectCategory(item as string) as any;

  return {
    action,
    item,
    quantity,
    category,
    language: "en"
  };
}
