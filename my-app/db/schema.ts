import { pgTable, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

export const onboardingProfiles = pgTable("onboarding_profiles", {
  userId: text("user_id").primaryKey(),
  age: integer("age").notNull(),
  height: integer("height").notNull(),
  gender: text("gender").notNull(),
  bodyType: text("body_type").notNull(),
  skinTone: text("skin_tone").notNull(),
  stylePreferences: jsonb("style_preferences").$type<string[]>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
