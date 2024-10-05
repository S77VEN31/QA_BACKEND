// Connect to  a postgres database
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  user: "uc0s273qbjb0s2",
  host: "cc0gj7hsrh0ht8.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com",
  database: "d66vb806f6fbur",
  password: "pb3e74a0b0a8f9508bca388a79b208ebc2807d4ae310d49d393cc83e909bd57af",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

const query = (text: string, params: any) => pool.query(text, params);

export { pool, query };
