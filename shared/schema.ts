import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Build orders schema
export const buildOrders = pgTable("build_orders", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  civilization: text("civilization").notNull(),
  type: text("type").notNull(),
  difficulty: integer("difficulty").notNull(),
  time: text("time").notNull(),
  description: text("description").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBuildOrderSchema = createInsertSchema(buildOrders).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertBuildOrder = z.infer<typeof insertBuildOrderSchema>;
export type BuildOrder = typeof buildOrders.$inferSelect;
