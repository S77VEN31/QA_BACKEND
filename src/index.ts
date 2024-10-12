// ENV
import dotenv from "dotenv";
// Express
import express, { Request, Response } from "express";
// Database connection
import { pool } from "./database";
// Routes
import {
  authRoutes,
  departmentRoutes,
  fortnightRoutes,
  reportRoutes,
  collaboratorRoutes,
} from "./routes";
// CORS
import cors from "cors";
// Middlewares
import { authenticateToken } from "./middlewares";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    client.release();
    res.send(
      `Hello, TypeScript with Express! Current time from DB: ${result.rows[0].now}`
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Error connecting to the database");
  }
});

app.use("/department", departmentRoutes);
app.use("/report", authenticateToken, reportRoutes);
app.use("/fortnight", authenticateToken, fortnightRoutes);
app.use("/collaborator", collaboratorRoutes); 
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
