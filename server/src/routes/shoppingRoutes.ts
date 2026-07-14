import { Router } from "express";
import {
  bulkDeleteItemsHandler,
  createItemHandler,
  deleteItemHandler,
  getItemsHandler,
  getRecommendationsHandler,
  parseVoiceCommandHandler,
  updateItemHandler
} from "../controllers/shoppingController.js";

export const shoppingRouter = Router();

shoppingRouter.get("/items", getItemsHandler);
shoppingRouter.post("/items", createItemHandler);
shoppingRouter.post("/items/bulk-delete", bulkDeleteItemsHandler);
shoppingRouter.patch("/items/:id", updateItemHandler);
shoppingRouter.delete("/items/:id", deleteItemHandler);
shoppingRouter.post("/voice/parse", parseVoiceCommandHandler);
shoppingRouter.get("/recommendations", getRecommendationsHandler);
