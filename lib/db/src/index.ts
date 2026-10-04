import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// Database connection is disabled since it's not being used yet
export const pool = null as any;
export const db = null as any;

export * from "./schema";
