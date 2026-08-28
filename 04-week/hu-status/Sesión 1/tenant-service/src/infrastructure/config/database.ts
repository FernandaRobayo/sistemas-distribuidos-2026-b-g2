import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg as unknown as { Pool: new (config: { connectionString: string }) => unknown };

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

export const pool = new Pool({
  connectionString: databaseUrl,
});
