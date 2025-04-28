import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Build orders API
  app.get('/api/build-orders', async (_req, res) => {
    try {
      // This would fetch from a real database in production
      // For now, we return mock data for development
      const buildOrders = [
        {
          id: 1,
          name: "Fast Heroic Age",
          civilization: "Greek",
          type: "Economic",
          difficulty: 3,
          time: "8:30",
          description: "Focus on economic development to reach the Heroic Age quickly."
        },
        {
          id: 2,
          name: "Archer Rush",
          civilization: "Egyptian",
          type: "Offensive",
          difficulty: 2,
          time: "5:45",
          description: "Quickly train archers for an early offensive strategy."
        },
        {
          id: 3,
          name: "Fast Mythical Creatures",
          civilization: "Norse",
          type: "Offensive",
          difficulty: 4,
          time: "7:15",
          description: "Rush to produce powerful mythical units to overwhelm opponents."
        },
        {
          id: 4,
          name: "Divine Intervention",
          civilization: "Greek",
          type: "Divine Powers",
          difficulty: 5,
          time: "12:30",
          description: "Focus on favor generation to call upon powerful divine powers."
        },
        {
          id: 5,
          name: "Defender's Stance",
          civilization: "Egyptian",
          type: "Defensive",
          difficulty: 3,
          time: "6:45",
          description: "Build strong defensive structures to withstand early attacks."
        },
        {
          id: 6,
          name: "Raiding Party",
          civilization: "Norse",
          type: "Offensive",
          difficulty: 1,
          time: "4:30",
          description: "Simple raiding strategy focused on disrupting enemy economy."
        }
      ];
      
      res.json(buildOrders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch build orders" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
