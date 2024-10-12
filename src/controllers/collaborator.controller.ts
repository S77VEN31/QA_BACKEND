// Express
import { Request, Response } from "express";
// Database
import { pool } from "../database";

/**
 * Controller to retrieve the name of a collaborator by their card ID (cédula).
 *
 * This method receives a card ID from the query parameters, validates it, and queries the database
 * using a stored procedure (`getempleadonombre`) to retrieve the collaborator's information.
 * If the card ID is missing or invalid, or if the collaborator does not exist, an appropriate error response is sent.
 *
 * @async
 * @function getCollaboratorName
 * @param {Request} req - Express request object, containing the card ID in req.query.cardID.
 * @param {Response} res - Express response object, used to send responses to the client.
 *
 * @throws {Error} 400 - If the card ID is missing, invalid, or the collaborator does not exist.
 * @throws {Error} 500 - If an unexpected error occurs while fetching the collaborator's name.
 *
 * @returns {void} Does not return a value, sends a JSON response with the collaborator's information or an error message.
 */
export const getCollaboratorName = async (req: Request, res: Response) => {
  try {
    const cardID = req.query.cardID
      ? parseInt(req.query.cardID as string)
      : null;

    let result;

    if (cardID) {
      result = await pool.query("SELECT * FROM getempleadonombre($1)", [cardID]); 
      res.status(200).json(result.rows[0]);
    } else {
      res.status(400).json({
        message: `Debe enviar una cédula.`,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: `El empleado no existe.`,
    });
  }
};