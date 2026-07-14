import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  createShoppingItem,
  deleteShoppingItems,
  deleteShoppingItem,
  getShoppingItems,
  updateShoppingItem
} from "../services/shoppingService.js";
import { buildRecommendations } from "../services/recommendationService.js";
import { ShoppingItemModel } from "../models/ShoppingItem.js";
import { parseVoiceCommand } from "../services/geminiService.js";

const createItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
  category: z.string().optional(),
  brand: z.string().optional(),
  price: z.number().min(0).optional(),
  notes: z.string().optional(),
  favorite: z.boolean().optional(),
  reminderAt: z.string().optional(),
  purchased: z.boolean().optional()
});

const updateItemSchema = createItemSchema.partial();

const querySchema = z.object({
  query: z.string().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional()
});

const bulkDeleteSchema = z.object({
  ids: z.array(z.string().min(1)).min(1)
});

export const createItemHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = createItemSchema.parse(req.body);
    const item = await createShoppingItem(payload);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const getItemsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = querySchema.parse(req.query);
    const items = await getShoppingItems(filters);
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

export const updateItemHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = updateItemSchema.parse(req.body);
    const item = await updateShoppingItem(String(req.params.id), payload);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const deleteItemHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteShoppingItem(String(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const bulkDeleteItemsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = bulkDeleteSchema.parse(req.body);
    const deletedCount = await deleteShoppingItems(payload.ids);
    res.json({ success: true, data: { deletedCount } });
  } catch (error) {
    next(error);
  }
};

export const parseVoiceCommandHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = z.object({ text: z.string().min(1) }).parse(req.body);
    const command = await parseVoiceCommand(payload.text);
    res.json({ success: true, data: command });
  } catch (error) {
    next(error);
  }
};

export const getRecommendationsHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const history = await ShoppingItemModel.find({ purchased: true }).sort({ updatedAt: -1 }).limit(50);
    const recommendations = buildRecommendations(history);
    res.json({ success: true, data: recommendations });
  } catch (error) {
    next(error);
  }
};
