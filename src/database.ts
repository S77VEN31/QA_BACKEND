// Connect to  a postgres database
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  user: isProduction ? process.env.PG_USER_PROD : process.env.PG_USER_DEV,
  host: isProduction ? process.env.PG_HOST_PROD : process.env.PG_HOST_DEV,
  database: isProduction
    ? process.env.PG_DATABASE_PROD
    : process.env.PG_DATABASE_DEV,
  password: isProduction
    ? process.env.PG_PASSWORD_PROD
    : process.env.PG_PASSWORD_DEV,
  port: isProduction
    ? parseInt(process.env.PG_PORT_PROD || "5432")
    : parseInt(process.env.PG_PORT_DEV || "5432"),
  ssl: isProduction ? { rejectUnauthorized: false } : undefined,
});

const query = (text: string, params: any) => pool.query(text, params);

export { pool, query };

