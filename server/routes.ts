import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBuildOrderSchema, insertBuildOrderEntrySchema } from "@shared/schema";
import { z } from "zod";

// Utility middleware to validate request body using Zod
const validateBody = (schema: z.ZodType<any, any>) => (req: Request, res: Response, next: Function) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors
      });
    }
    return res.status(500).json({ message: "Internal server error during validation" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // ----- Build Orders API -----
  
  // Get all build orders with optional filters
  app.get('/api/build-orders', async (req, res) => {
    try {
      const filters = {
        civilization: req.query.civilization as string | undefined,
        god: req.query.god as string | undefined,
        type: req.query.type as string | undefined,
        isPublic: req.query.isPublic === 'true' ? true : undefined
      };
      
      // Remove undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof typeof filters] === undefined) {
          delete filters[key as keyof typeof filters];
        }
      });
      
      const buildOrders = await storage.getBuildOrders(filters);
      res.json(buildOrders);
    } catch (error) {
      console.error("Error fetching build orders:", error);
      res.status(500).json({ message: "Failed to fetch build orders" });
    }
  });
  
  // Get a specific build order by ID
  app.get('/api/build-orders/:id', async (req, res) => {
    try {
      const buildOrderId = parseInt(req.params.id);
      if (isNaN(buildOrderId)) {
        return res.status(400).json({ message: "Invalid build order ID" });
      }
      
      const buildOrder = await storage.getBuildOrder(buildOrderId);
      if (!buildOrder) {
        return res.status(404).json({ message: "Build order not found" });
      }
      
      res.json(buildOrder);
    } catch (error) {
      console.error("Error fetching build order:", error);
      res.status(500).json({ message: "Failed to fetch build order" });
    }
  });
  
  // Create a new build order
  app.post('/api/build-orders', validateBody(insertBuildOrderSchema), async (req, res) => {
    try {
      const buildOrderData = req.body;
      
      // Add user ID if authenticated (would come from auth middleware)
      // buildOrderData.userId = req.user?.id;
      
      const newBuildOrder = await storage.createBuildOrder(buildOrderData);
      res.status(201).json(newBuildOrder);
    } catch (error) {
      console.error("Error creating build order:", error);
      res.status(500).json({ message: "Failed to create build order" });
    }
  });
  
  // Update a build order
  app.put('/api/build-orders/:id', async (req, res) => {
    try {
      const buildOrderId = parseInt(req.params.id);
      if (isNaN(buildOrderId)) {
        return res.status(400).json({ message: "Invalid build order ID" });
      }
      
      const buildOrderData = req.body;
      
      // Check if build order exists
      const existingBuildOrder = await storage.getBuildOrder(buildOrderId);
      if (!existingBuildOrder) {
        return res.status(404).json({ message: "Build order not found" });
      }
      
      // Check ownership if needed
      // if (existingBuildOrder.userId !== req.user?.id) {
      //   return res.status(403).json({ message: "Unauthorized to update this build order" });
      // }
      
      const updatedBuildOrder = await storage.updateBuildOrder(buildOrderId, buildOrderData);
      res.json(updatedBuildOrder);
    } catch (error) {
      console.error("Error updating build order:", error);
      res.status(500).json({ message: "Failed to update build order" });
    }
  });
  
  // Delete a build order
  app.delete('/api/build-orders/:id', async (req, res) => {
    try {
      const buildOrderId = parseInt(req.params.id);
      if (isNaN(buildOrderId)) {
        return res.status(400).json({ message: "Invalid build order ID" });
      }
      
      // Check if build order exists
      const existingBuildOrder = await storage.getBuildOrder(buildOrderId);
      if (!existingBuildOrder) {
        return res.status(404).json({ message: "Build order not found" });
      }
      
      // Check ownership if needed
      // if (existingBuildOrder.userId !== req.user?.id) {
      //   return res.status(403).json({ message: "Unauthorized to delete this build order" });
      // }
      
      await storage.deleteBuildOrder(buildOrderId);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting build order:", error);
      res.status(500).json({ message: "Failed to delete build order" });
    }
  });
  
  // ----- Build Order Entries API -----
  
  // Get all entries for a build order
  app.get('/api/build-orders/:id/entries', async (req, res) => {
    try {
      const buildOrderId = parseInt(req.params.id);
      if (isNaN(buildOrderId)) {
        return res.status(400).json({ message: "Invalid build order ID" });
      }
      
      // Check if build order exists
      const buildOrder = await storage.getBuildOrder(buildOrderId);
      if (!buildOrder) {
        return res.status(404).json({ message: "Build order not found" });
      }
      
      const entries = await storage.getBuildOrderEntries(buildOrderId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching build order entries:", error);
      res.status(500).json({ message: "Failed to fetch build order entries" });
    }
  });
  
  // Create a new entry for a build order
  app.post('/api/build-orders/:id/entries', validateBody(insertBuildOrderEntrySchema), async (req, res) => {
    try {
      const buildOrderId = parseInt(req.params.id);
      if (isNaN(buildOrderId)) {
        return res.status(400).json({ message: "Invalid build order ID" });
      }
      
      // Check if build order exists
      const buildOrder = await storage.getBuildOrder(buildOrderId);
      if (!buildOrder) {
        return res.status(404).json({ message: "Build order not found" });
      }
      
      // Check ownership if needed
      // if (buildOrder.userId !== req.user?.id) {
      //   return res.status(403).json({ message: "Unauthorized to add entries to this build order" });
      // }
      
      // Get current entries to determine the next sequence number
      const currentEntries = await storage.getBuildOrderEntries(buildOrderId);
      const nextSequence = currentEntries.length > 0 
        ? Math.max(...currentEntries.map(e => e.sequence)) + 1 
        : 1;
      
      const entryData = {
        ...req.body,
        buildOrderId,
        sequence: req.body.sequence || nextSequence
      };
      
      const newEntry = await storage.createBuildOrderEntry(entryData);
      res.status(201).json(newEntry);
    } catch (error) {
      console.error("Error creating build order entry:", error);
      res.status(500).json({ message: "Failed to create build order entry" });
    }
  });
  
  // Update a specific entry
  app.put('/api/build-order-entries/:id', async (req, res) => {
    try {
      const entryId = parseInt(req.params.id);
      if (isNaN(entryId)) {
        return res.status(400).json({ message: "Invalid entry ID" });
      }
      
      // Check if entry exists
      const existingEntry = await storage.getBuildOrderEntry(entryId);
      if (!existingEntry) {
        return res.status(404).json({ message: "Entry not found" });
      }
      
      // Check ownership via build order if needed
      // const buildOrder = await storage.getBuildOrder(existingEntry.buildOrderId);
      // if (buildOrder && buildOrder.userId !== req.user?.id) {
      //   return res.status(403).json({ message: "Unauthorized to update this entry" });
      // }
      
      const updatedEntry = await storage.updateBuildOrderEntry(entryId, req.body);
      res.json(updatedEntry);
    } catch (error) {
      console.error("Error updating build order entry:", error);
      res.status(500).json({ message: "Failed to update build order entry" });
    }
  });
  
  // Delete a specific entry
  app.delete('/api/build-order-entries/:id', async (req, res) => {
    try {
      const entryId = parseInt(req.params.id);
      if (isNaN(entryId)) {
        return res.status(400).json({ message: "Invalid entry ID" });
      }
      
      // Check if entry exists
      const existingEntry = await storage.getBuildOrderEntry(entryId);
      if (!existingEntry) {
        return res.status(404).json({ message: "Entry not found" });
      }
      
      // Check ownership via build order if needed
      // const buildOrder = await storage.getBuildOrder(existingEntry.buildOrderId);
      // if (buildOrder && buildOrder.userId !== req.user?.id) {
      //   return res.status(403).json({ message: "Unauthorized to delete this entry" });
      // }
      
      await storage.deleteBuildOrderEntry(entryId);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting build order entry:", error);
      res.status(500).json({ message: "Failed to delete build order entry" });
    }
  });
  
  // Reorder entries for a build order
  app.post('/api/build-orders/:id/entries/reorder', async (req, res) => {
    try {
      const buildOrderId = parseInt(req.params.id);
      if (isNaN(buildOrderId)) {
        return res.status(400).json({ message: "Invalid build order ID" });
      }
      
      const { entryIds } = req.body;
      if (!Array.isArray(entryIds)) {
        return res.status(400).json({ message: "Invalid entry IDs array" });
      }
      
      // Check if build order exists
      const buildOrder = await storage.getBuildOrder(buildOrderId);
      if (!buildOrder) {
        return res.status(404).json({ message: "Build order not found" });
      }
      
      // Check ownership if needed
      // if (buildOrder.userId !== req.user?.id) {
      //   return res.status(403).json({ message: "Unauthorized to reorder entries for this build order" });
      // }
      
      const reorderedEntries = await storage.reorderBuildOrderEntries(buildOrderId, entryIds);
      res.json(reorderedEntries);
    } catch (error) {
      console.error("Error reordering build order entries:", error);
      res.status(500).json({ message: "Failed to reorder build order entries" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
