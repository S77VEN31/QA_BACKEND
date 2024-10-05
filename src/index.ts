import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { pool } from "./database"; // Asume que el archivo de conexión a la base de datos está en un archivo separado llamado `db.ts`
import { departmentRoutes } from "./routes";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
// Endpoint para probar la conexión a la base de datos
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
