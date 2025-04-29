import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

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
  god: text("god").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  isPublic: boolean("is_public").default(false).notNull(),
  tags: jsonb("tags").default([]),
});

// Build order entries with dynamic structure
export const buildOrderEntries = pgTable("build_order_entries", {
  id: serial("id").primaryKey(),
  buildOrderId: integer("build_order_id").notNull().references(() => buildOrders.id, { onDelete: "cascade" }),
  sequence: integer("sequence").default(0), // Order in which entries appear
  mainAction: text("main_action").notNull(), // Main row content
  miscellaneousAction: text("miscellaneous_action"), // Optional row content
  villagerCount: integer("villager_count"), // Optional villager count
  timeStamp: text("time_stamp"), // Optional timestamp (like "2:15")
  agePhase: text("age_phase"), // Optional age/phase information
  population: integer("population"), // Optional population count
  notes: text("notes"), // Optional notes
  isComplete: boolean("is_complete").default(false), // Whether this step is complete
});

// Define relations between tables
export const buildOrdersRelations = relations(buildOrders, ({ many, one }) => ({
  entries: many(buildOrderEntries),
  user: one(users, {
    fields: [buildOrders.userId],
    references: [users.id],
  }),
}));

export const buildOrderEntriesRelations = relations(buildOrderEntries, ({ one }) => ({
  buildOrder: one(buildOrders, {
    fields: [buildOrderEntries.buildOrderId],
    references: [buildOrders.id],
  }),
}));

// Schemas for insertable data
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBuildOrderSchema = createInsertSchema(buildOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBuildOrderEntrySchema = createInsertSchema(buildOrderEntries).omit({
  id: true,
}).partial();


// Types for insertable data
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertBuildOrder = z.infer<typeof insertBuildOrderSchema>;
export type BuildOrder = typeof buildOrders.$inferSelect;

export type InsertBuildOrderEntry = z.infer<typeof insertBuildOrderEntrySchema>;
export type BuildOrderEntry = typeof buildOrderEntries.$inferSelect;