import { 
  users, buildOrders, buildOrderEntries,
  type User, type InsertUser,
  type BuildOrder, type InsertBuildOrder,
  type BuildOrderEntry, type InsertBuildOrderEntry
} from "@shared/schema";
import { eq, and, asc, desc } from "drizzle-orm";
import { db } from "./db";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Build order operations
  getBuildOrder(id: number): Promise<BuildOrder | undefined>;
  getBuildOrders(filters?: {
    civilization?: string;
    god?: string;
    type?: string;
    userId?: number;
    isPublic?: boolean;
  }): Promise<BuildOrder[]>;
  createBuildOrder(buildOrder: InsertBuildOrder): Promise<BuildOrder>;
  updateBuildOrder(id: number, buildOrder: Partial<InsertBuildOrder>): Promise<BuildOrder | undefined>;
  deleteBuildOrder(id: number): Promise<boolean>;
  
  // Build order entry operations
  getBuildOrderEntries(buildOrderId: number): Promise<BuildOrderEntry[]>;
  getBuildOrderEntry(id: number): Promise<BuildOrderEntry | undefined>;
  createBuildOrderEntry(entry: InsertBuildOrderEntry): Promise<BuildOrderEntry>;
  updateBuildOrderEntry(id: number, entry: Partial<InsertBuildOrderEntry>): Promise<BuildOrderEntry | undefined>;
  deleteBuildOrderEntry(id: number): Promise<boolean>;
  reorderBuildOrderEntries(buildOrderId: number, entryIds: number[]): Promise<BuildOrderEntry[]>;
}

// Database implementation
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Build order operations
  async getBuildOrder(id: number): Promise<BuildOrder | undefined> {
    const [buildOrder] = await db.select().from(buildOrders).where(eq(buildOrders.id, id));
    return buildOrder;
  }

  async getBuildOrders(filters?: {
    civilization?: string;
    god?: string;
    type?: string;
    userId?: number;
    isPublic?: boolean;
  }): Promise<BuildOrder[]> {
    let query = db.select().from(buildOrders);
    
    if (filters) {
      const conditions = [];
      
      if (filters.civilization) {
        conditions.push(eq(buildOrders.civilization, filters.civilization));
      }
      
      if (filters.god) {
        conditions.push(eq(buildOrders.god, filters.god));
      }
      
      if (filters.type) {
        conditions.push(eq(buildOrders.type, filters.type));
      }
      
      if (filters.userId) {
        conditions.push(eq(buildOrders.userId, filters.userId));
      }
      
      if (filters.isPublic !== undefined) {
        conditions.push(eq(buildOrders.isPublic, filters.isPublic));
      }
      
      if (conditions.length > 0) {
        // Combine all conditions with AND
        let combinedCondition = conditions[0];
        for (let i = 1; i < conditions.length; i++) {
          combinedCondition = and(combinedCondition, conditions[i]);
        }
        query = query.where(combinedCondition);
      }
    }
    
    return await query.orderBy(desc(buildOrders.createdAt));
  }

  async createBuildOrder(buildOrderData: InsertBuildOrder): Promise<BuildOrder> {
    const [buildOrder] = await db.insert(buildOrders).values(buildOrderData).returning();
    return buildOrder;
  }

  async updateBuildOrder(id: number, buildOrderData: Partial<InsertBuildOrder>): Promise<BuildOrder | undefined> {
    const [updatedBuildOrder] = await db
      .update(buildOrders)
      .set({ ...buildOrderData, updatedAt: new Date() })
      .where(eq(buildOrders.id, id))
      .returning();
    
    return updatedBuildOrder;
  }

  async deleteBuildOrder(id: number): Promise<boolean> {
    const result = await db.delete(buildOrders).where(eq(buildOrders.id, id));
    return true; // In Drizzle, delete doesn't return count, so we assume success if no error
  }

  // Build order entry operations
  async getBuildOrderEntries(buildOrderId: number): Promise<BuildOrderEntry[]> {
    const entries = await db
        .select({
          id: buildOrderEntries.id,
          buildOrderId: buildOrderEntries.buildOrderId,
          sequence: buildOrderEntries.sequence,
          mainAction: buildOrderEntries.mainAction,
          miscellaneousAction: buildOrderEntries.miscellaneousAction,
          notes: buildOrderEntries.notes,
          food: buildOrderEntries.food,
          wood: buildOrderEntries.wood,
          gold: buildOrderEntries.gold
        })
        .from(buildOrderEntries)
        .where(eq(buildOrderEntries.buildOrderId, buildOrderId))
        .orderBy(asc(buildOrderEntries.sequence));
      
      return entries;
  }

  async getBuildOrderEntry(id: number): Promise<BuildOrderEntry | undefined> {
    const [entry] = await db.select().from(buildOrderEntries).where(eq(buildOrderEntries.id, id));
    return entry;
  }

  async createBuildOrderEntry(entryData: InsertBuildOrderEntry): Promise<BuildOrderEntry> {
    const [entry] = await db.insert(buildOrderEntries).values(entryData).returning();
    return entry;
  }

  async updateBuildOrderEntry(id: number, entryData: Partial<InsertBuildOrderEntry>): Promise<BuildOrderEntry | undefined> {
    const [updatedEntry] = await db
      .update(buildOrderEntries)
      .set(entryData)
      .where(eq(buildOrderEntries.id, id))
      .returning();
    
    return updatedEntry;
  }

  async deleteBuildOrderEntry(id: number): Promise<boolean> {
    await db.delete(buildOrderEntries).where(eq(buildOrderEntries.id, id));
    return true;
  }

  async reorderBuildOrderEntries(buildOrderId: number, entryIds: number[]): Promise<BuildOrderEntry[]> {
    // Update the sequence of each entry based on its position in the entryIds array
    for (let i = 0; i < entryIds.length; i++) {
      await db
        .update(buildOrderEntries)
        .set({ sequence: i + 1 })
        .where(
          and(
            eq(buildOrderEntries.id, entryIds[i]),
            eq(buildOrderEntries.buildOrderId, buildOrderId)
          )
        );
    }
    
    // Return the updated entries in the correct order
    return this.getBuildOrderEntries(buildOrderId);
  }
}

// Use database storage
export const storage = new DatabaseStorage();
