"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistItems = exports.cartItems = exports.orders = exports.products = exports.users = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
/**
 * Core user table
 */
exports.users = (0, mysql_core_1.mysqlTable)("users", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    openId: (0, mysql_core_1.varchar)("openId", { length: 64 }).notNull().unique(),
    name: (0, mysql_core_1.text)("name"),
    email: (0, mysql_core_1.varchar)("email", { length: 320 }).unique(),
    passwordHash: (0, mysql_core_1.text)("passwordHash"),
    loginMethod: (0, mysql_core_1.varchar)("loginMethod", { length: 64 }),
    role: (0, mysql_core_1.mysqlEnum)("role", ["user", "admin"]).default("user").notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").defaultNow().onUpdateNow().notNull(),
    lastSignedIn: (0, mysql_core_1.timestamp)("lastSignedIn").defaultNow().notNull(),
});
/**
 * Products table - Focused on unique pieces
 */
exports.products = (0, mysql_core_1.mysqlTable)("products", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull(), // Changed from title to name for vision consistency
    description: (0, mysql_core_1.text)("description"),
    story: (0, mysql_core_1.text)("story"), // New field
    price: (0, mysql_core_1.decimal)("price", { precision: 10, scale: 2 }).notNull(),
    images: (0, mysql_core_1.json)("images").$type().default([]),
    isSold: (0, mysql_core_1.int)("isSold").default(0).notNull(), // 0 for available, 1 for sold
    ownerName: (0, mysql_core_1.varchar)("ownerName", { length: 255 }), // To show who collected it (for Stories system)
    category: (0, mysql_core_1.varchar)("category", { length: 100 }).default("unique").notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").defaultNow().onUpdateNow().notNull(),
});
/**
 * Orders table
 */
exports.orders = (0, mysql_core_1.mysqlTable)("orders", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    productId: (0, mysql_core_1.int)("productId").notNull(),
    customerName: (0, mysql_core_1.varchar)("customerName", { length: 255 }).notNull(),
    customerEmail: (0, mysql_core_1.varchar)("customerEmail", { length: 320 }).notNull(),
    shippingAddress: (0, mysql_core_1.text)("shippingAddress").notNull(),
    totalPrice: (0, mysql_core_1.decimal)("totalPrice", { precision: 10, scale: 2 }).notNull(),
    status: (0, mysql_core_1.mysqlEnum)("status", ["pending", "completed", "cancelled"]).default("pending").notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
});
// Keeping legacy tables for compatibility if needed, but the vision uses the new ones above.
exports.cartItems = (0, mysql_core_1.mysqlTable)("cartItems", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    userId: (0, mysql_core_1.int)("userId").notNull(),
    productId: (0, mysql_core_1.int)("productId").notNull(),
    quantity: (0, mysql_core_1.int)("quantity").default(1).notNull(),
});
exports.wishlistItems = (0, mysql_core_1.mysqlTable)("wishlistItems", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    userId: (0, mysql_core_1.int)("userId").notNull(),
    productId: (0, mysql_core_1.int)("productId").notNull(),
});
