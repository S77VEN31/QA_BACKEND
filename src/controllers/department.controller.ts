// Express
import { Request, Response } from "express";
// Database
import { pool } from "../database";

const getDepartments = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM getdepartamentos()");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting departments");
  }
};

export { getDepartments };
