import mongoose, { Schema } from "mongoose";
import { DEFAULT_CATEGORIES } from "../constants/categories.js";

export interface ShoppingItemDocument extends mongoose.Document {
  name: string;
  quantity: number;
  category: string;
  brand?: string;
  price?: number;
  notes?: string;
  favorite: boolean;
  reminderAt?: Date;
  purchased: boolean;
  lastPurchasedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const shoppingItemSchema = new Schema<ShoppingItemDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    category: {
      type: String,
      enum: DEFAULT_CATEGORIES,
      required: true
    },
    brand: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      min: 0
    },
    notes: {
      type: String,
      trim: true
    },
    favorite: {
      type: Boolean,
      default: false
    },
    reminderAt: Date,
    purchased: {
      type: Boolean,
      default: false
    },
    lastPurchasedAt: Date
  },
  {
    timestamps: true
  }
);

shoppingItemSchema.index({ name: "text", brand: "text", category: "text" });

export const ShoppingItemModel = mongoose.model<ShoppingItemDocument>("ShoppingItem", shoppingItemSchema);
