// Express
import { Request, Response } from "express";
// Database
import { pool } from "../database";
// Utils
import { formatDate } from "../utils";

/**
 * Get report details with optional filters on ID, date range, and department.
 * This function retrieves the report details from the database based on the provided filters.
 * It sends the result as a JSON response, containing an array of objects where each object
 * represents a row in the report.
 * 
 * @param {Request} req - The request object, which contains the following query parameters:
 *    @param {string} [startDate] - The start date for filtering the report (YYYY-MM-DD format).
 *    @param {string} [endDate] - The end date for filtering the report (YYYY-MM-DD format).
 *    @param {string} [IDCard] - The ID card number for filtering by a specific person.
 *    @param {string} [departmentID] - The department ID to filter the report by department.
 *    @param {string} [startRange] - The starting index for pagination, defaults to 0 if not provided.
 *    @param {string} [limitRange] - The limit of rows to retrieve, defaults to 100 if not provided.
 * 
 * @param {Response} res - The response object used to send the report data back to the client as JSON.
 * 
 * @returns {void} - Sends the report rows as a JSON response or an error message in case of failure.
 */
const getReportDetail = async (req: Request, res: Response) => {
  try {
    let { startDate, endDate, IDCard, departmentID, startRange, limitRange } =
      req.query;

    const formattedStartDate = formatDate(startDate as string);
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
        formattedStartDate,
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

