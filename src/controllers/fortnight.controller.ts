// Express
import { Request, Response } from "express";
// Database
import { pool } from "../database";
// Utils
import { formatTimestamp } from "../utils";

const insertFortnight = async (req: Request, res: Response) => {
  try {
    let { timestamp } = req.body;
    let formattedTimestamp;
    try {
      formattedTimestamp = formatTimestamp(timestamp as string);
    } catch (err) {
      console.error(err);
      res.status(404).send("Error insertando quincena: Fecha inválida");
    }
    const result = await pool.query("CALL insertquincena($1::TIMESTAMP)", [
      timestamp,
    ]);

    res.status(201).send("Success inserting fortnight");
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).send(`${error.message}`);
    }
  }
};

const insertNFortnights = async (req: Request, res: Response) => {
  try {
    let { timestamp, n } = req.body;
    let formattedTimestamp;
    try {
      formattedTimestamp = formatTimestamp(timestamp as string);
    } catch (err) {
      console.error(err);
      res
        .status(404)
        .send("Error insertando múltiples quincenas: Fecha de inicio inválida");
    }
    const result = await pool.query(
      "CALL insertnquincenas($1::INT, $2::TIMESTAMP)",
      [n, timestamp]
    );

    res.status(201).send("Success inserting fortnights");
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).send(`${error.message}`);
    }
  }
};

const calculateTax = async (req: Request, res: Response) => {
  try {
    const { salary } = req.query;
    const salaryNumber = salary ? parseInt(salary as string) : null;

    const result = await pool.query(
      "SELECT * FROM calculate_tax($1::NUMERIC)",
      [salaryNumber]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting report detail");
  }
};

export { insertFortnight, insertNFortnights, calculateTax };
