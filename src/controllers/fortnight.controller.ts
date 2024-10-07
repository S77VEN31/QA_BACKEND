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
      res.status(404).send("Error inserting fortnight: Invalid timestamp");
    }
    const result = await pool.query("CALL insertquincena($1::TIMESTAMP)", [
      timestamp,
    ]);

    res.status(201).send("Success inserting fortnight");
  } catch (err) {
    console.error(err);
    res.status(400).send(`Error inserting fortnight: ${err}`);
  }
};

export { insertFortnight };
