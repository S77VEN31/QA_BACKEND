// Express
import { Request, Response } from "express";
// Database
import { pool } from "../database";
// Utils
import { formatDate } from "../utils";

// Get report details. There can be filters on ID, date range, and department.
// It gets the report details from the database and sends them as a response.
// The response is an array of objects, each object representing a row in the report.
// It receives a start range from where its going to start getting the data and a limit range
const getReportDetail = async (req: Request, res: Response) => {
  try {
    let { date, endDate, IDCard, departmentID, startRange, limitRange } =
      req.query;

    const formattedDate = formatDate(date as string);
    const formattedEndDate = formatDate(endDate as string);
    const idCardNumber = IDCard ? parseInt(IDCard as string, 10) : null;
    const departmentIdNumber = departmentID
      ? parseInt(departmentID as string, 10)
      : null;
    const start = startRange ? parseInt(startRange as string, 10) : 0;
    const limit = limitRange ? parseInt(limitRange as string, 10) : 100;

    const result = await pool.query(
      "SELECT * FROM getquincenas($1::DATE, $2::DATE, $3::INT, $4::SMALLINT, $5::INT, $6::INT)",
      [
        formattedDate,
        formattedEndDate,
        idCardNumber,
        departmentIdNumber,
        start,
        limit,
      ]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting report detail");
  }
};

// Get total reports. There can be filters on ID, date range, and department.
const getReportTotal = async (req: Request, res: Response) => {
  try {
    let { date, endDate, IDCard, departmentID } = req.query;

    const formattedDate = formatDate(date as string);
    const formattedEndDate = formatDate(endDate as string);
    const idCardNumber = IDCard ? parseInt(IDCard as string, 10) : null;
    const departmentIdNumber = departmentID
      ? parseInt(departmentID as string, 10)
      : null;

    const result = await pool.query(
      "SELECT * FROM getquincenastotal($1::DATE, $2::DATE, $3::INT, $4::SMALLINT)",
      [formattedDate, formattedEndDate, idCardNumber, departmentIdNumber]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting report detail");
  }
};

export { getReportDetail, getReportTotal };
