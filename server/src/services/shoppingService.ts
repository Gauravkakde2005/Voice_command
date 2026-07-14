import mongoose from "mongoose";
import { ShoppingItemModel, type ShoppingItemDocument } from "../models/ShoppingItem.js";
import type { ShoppingFilters } from "../types/shopping.js";
import { detectCategory } from "../utils/categorizer.js";
import { AppError } from "../utils/appError.js";

interface UpsertShoppingItemInput {
  name: string;
  quantity?: number;
  category?: string;
  brand?: string;
  price?: number;
  notes?: string;
  favorite?: boolean;
  reminderAt?: string;
  purchased?: boolean;
}

export const createShoppingItem = async (payload: UpsertShoppingItemInput): Promise<ShoppingItemDocument> => {
  const item = await ShoppingItemModel.create({
    ...payload,
    category: payload.category ?? detectCategory(payload.name),
    reminderAt: payload.reminderAt ? new Date(payload.reminderAt) : undefined
  });

  return item;
};

export const getShoppingItems = async (filters: ShoppingFilters): Promise<ShoppingItemDocument[]> => {
  const query: Record<string, unknown> = {};

  if (filters.query) {
    query.$or = [
      { name: { $regex: filters.query, $options: "i" } },
      { brand: { $regex: filters.query, $options: "i" } }
    ];
  }

  if (filters.brand) {
    query.brand = { $regex: filters.brand, $options: "i" };
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};
    if (filters.minPrice !== undefined) {
      (query.price as Record<string, number>).$gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      (query.price as Record<string, number>).$lte = filters.maxPrice;
    }
  }

  return ShoppingItemModel.find(query).sort({ favorite: -1, createdAt: -1 });
};

export const updateShoppingItem = async (
  id: string,
  payload: Partial<UpsertShoppingItemInput>
): Promise<ShoppingItemDocument> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid shopping item id.", 400);
  }

  const item = await ShoppingItemModel.findByIdAndUpdate(
    id,
    {
      ...payload,
      ...(payload.name && !payload.category ? { category: detectCategory(payload.name) } : {}),
      ...(payload.reminderAt !== undefined ? { reminderAt: payload.reminderAt ? new Date(payload.reminderAt) : null } : {})
    },
    { new: true, runValidators: true }
  );

  if (!item) {
    throw new AppError("Shopping item not found.", 404);
  }

  return item;
};

export const deleteShoppingItem = async (id: string): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid shopping item id.", 400);
  }

  const item = await ShoppingItemModel.findByIdAndDelete(id);

  if (!item) {
    throw new AppError("Shopping item not found.", 404);
  }
};

export const deleteShoppingItems = async (ids: string[]): Promise<number> => {
  const invalidId = ids.find((id) => !mongoose.Types.ObjectId.isValid(id));

  if (invalidId) {
    throw new AppError("One or more shopping item ids are invalid.", 400);
  }

  const result = await ShoppingItemModel.deleteMany({ _id: { $in: ids } });

  if (result.deletedCount === 0) {
    throw new AppError("Shopping items not found.", 404);
  }

  return result.deletedCount;
};

export const markItemPurchased = async (id: string): Promise<ShoppingItemDocument> =>
  updateShoppingItem(id, { purchased: true });
