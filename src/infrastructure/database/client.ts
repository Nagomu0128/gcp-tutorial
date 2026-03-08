import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool(
  process.env.DB_HOST?.startsWith("/cloudsql/")
    ? {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      }
    : {
        connectionString: process.env.DATABASE_URL,
      }
);

export const db = drizzle(pool, { schema });
