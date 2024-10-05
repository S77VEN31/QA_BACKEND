import { pool } from "../database";

import { Request, Response } from "express";

const create = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const result = await pool.query(
      "INSERT INTO department (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating department");
  }
};

export { create };
