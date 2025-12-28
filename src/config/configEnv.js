"use strict";
import dotenv from "dotenv";

dotenv.config();

export const HOST = process.env.DB_HOST || process.env.HOST || "localhost";
export const PORT = process.env.PORT || 3000;
export const DB_PORT = process.env.DB_PORT || 5432;
export const DB_USERNAME = process.env.DB_USERNAME;
export const PASSWORD = process.env.DB_PASSWORD;
export const DATABASE = process.env.DATABASE;
export const JWT_SECRET = process.env.JWT_SECRET;
export const cookieKey = process.env.COOKIE_KEY;
// Rango semestral (ISO date strings, por ejemplo: 2025-02-01)
export const SEMESTER_START = process.env.SEMESTER_START || null;
export const SEMESTER_END = process.env.SEMESTER_END || null;