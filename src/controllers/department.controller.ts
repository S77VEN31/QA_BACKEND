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

/**
 * Create a new department by calling a stored procedure with the provided department name.
 * This function extracts the department name from the query parameters and inserts it into
 * the database using a stored procedure. A success or error message is sent as a response.
 * 
 * @param {Request} req - The request object, containing the following query parameters:
 *    @param {string} [depNombre] - The name of the department to be created. This field is required.
 * 
 * @param {Response} res - The response object used to send the result back to the client.
 *    Sends a success message if the department is created successfully, or an error message
 *    if the department name is missing or an error occurs during the process.
 * 
 * @returns {void} - Sends a `201 Created` status with a success message, or a `400 Bad Request`
 *    status if `depNombre` is not provided. If there is a server error, sends a `500 Internal Server Error`.
 */
const createDepartment = async (req: Request, res: Response) => {
  try {
    // Extract depNombre from query parameters
    const depNombre = req.query.depNombre;

    // Check if depNombre is provided
    if (depNombre) {
      // Call the stored procedure to insert the department
      await pool.query("CALL insertDepartamento($1)", [depNombre]);

      // Send a success response
      res.status(201).send("Department inserted successfully");
    } else {
      res.status(400).send("Department name is required");
    }
  } catch (err) {
    // Log the error and send an error response
    console.error(err);
    res.status(500).send("Error inserting department");
  }
};

/**
 * Assign a salary to all employees in a specified department by calling a stored procedure.
 * This function extracts the department ID and salary from the query parameters and assigns
 * the provided salary to all employees in the department using the stored procedure.
 * A success or error message is sent as a response.
 * 
 * @param {Request} req - The request object, containing the following query parameters:
 *    @param {string} [departamentoId] - The ID of the department to which the salary will be assigned. This field is required.
 *    @param {number} [salario] - The salary amount to be assigned to all employees in the department. This field is required.
 * 
 * @param {Response} res - The response object used to send the result back to the client.
 *    Sends a success message if the salary is assigned successfully, or an error message if the 
 *    department ID or salary is missing, or if an error occurs during the process.
 * 
 * @returns {void} - Sends a `200 OK` status with a success message, or a `400 Bad Request` status
 *    if `departamentoId` or `salario` is not provided. If there is a server error, sends a 
 *    `500 Internal Server Error`.
 */
const assignSalaryToDepartment = async (req: Request, res: Response) => {
  try {
    // Extract depNombre from query parameters
    const departamentoId = req.query.departamentoId;
    const salario = req.query.salario;

    // Check if depNombre is provided
    if (departamentoId && salario) {
      // Call the stored procedure to insert the department
      await pool.query("CALL asignarSalarioDepartamento($1, $2)", [departamentoId, salario]);
      // Send a success response
      res.status(200).send("Salaries updated successfully");
    } else {
      res.status(400).send("Department id or salary is required");
    }
  } catch (err) {
    // Log the error and send an error response
    console.error(err);
    res.status(500).send("Error assigning salary to department");
  }
};

/**
 * Insert employees into a specified department by calling a stored procedure.
 * This function extracts the department ID and a list of employee IDs from the request body
 * and inserts them into the department using a stored procedure. It ensures that the 
 * department ID and a non-empty array of employee IDs are provided before proceeding.
 * A success or error message is sent as a response.
 * 
 * @param {Request} req - The request object, containing the following properties in the body:
 *    @param {number} [departamentoId] - The ID of the department into which the employees will be inserted. This field is required.
 *    @param {Array<number>} [empleados] - An array of employee IDs to be inserted into the department. This array must be non-empty.
 * 
 * @param {Response} res - The response object used to send the result back to the client.
 *    Sends a success message if the employees are inserted successfully, or an error message if the 
 *    department ID or employee list is missing, invalid, or empty. If an error occurs during 
 *    the process, a server error response is sent.
 * 
 * @returns {void} - Sends a `200 OK` status with a success message, or a `400 Bad Request` status
 *    if `departamentoId` or `empleados` array is missing or invalid. If there is a server error, 
 *    sends a `500 Internal Server Error`.
 */
const insertEmployeesIntoDepartment = async (req: Request, res: Response) => {
  try {
    // Extract depNombre from query parameters
    const { departamentoId, empleados } = req.body;

    // Check if departamentoId is provided and empleados is a valid array with at least one element
    if (departamentoId && Array.isArray(empleados) && empleados.length > 0) {
      // Call the stored procedure to assign salaries to employees in the department
      await pool.query("CALL insertEmpleadosDepartamentos($1, $2)", [departamentoId, empleados]);
      // Send a success response
      res.status(200).send("Employees inserted successfully");
    } else {
      res.status(400).send("Department id or employee list is required");
    }
  } catch (err) {
    // Log the error and send an error response
    console.error(err);
    res.status(500).send("Error assigning inserting employees to department");
  }
};

export { getDepartments, createDepartment, assignSalaryToDepartment, insertEmployeesIntoDepartment };
