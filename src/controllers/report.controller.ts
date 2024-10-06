// Express
import { Request, Response } from "express";
// Database
import { pool } from "../database";
// Utils
import { formatDate } from "../utils";

const getReportDetail = async (req: Request, res: Response) => {
  try {
    let { date, IDCard, departmentID, startRange, endRange } = req.query;

    const formattedDate = formatDate(date as string);
    const idCardNumber = IDCard ? parseInt(IDCard as string, 10) : null;
    const departmentIdNumber = departmentID
      ? parseInt(departmentID as string, 10)
      : null;
    const start = startRange ? parseInt(startRange as string, 10) : 0;
    const end = endRange ? parseInt(endRange as string, 10) : 100;

    const result = await pool.query(
      "SELECT * FROM getquincenas($1::DATE, $2::INT, $3::SMALLINT, $4::INT, $5::INT)",
      [formattedDate, idCardNumber, departmentIdNumber, start, end]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting report detail");
  }
};

export { getReportDetail };
