// Express
import { Request, Response } from "express";
// Database
import { pool } from "../database";

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const cardID = req.query.cardID
      ? parseInt(req.query.cardID as string)
      : null;

    let result;

    if (cardID) {
      result = await pool.query("SELECT * FROM getdepartamentos($1)", [cardID]);
    } else {
      result = await pool.query("SELECT * FROM getdepartamentos()");
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting departments");
  }
};

export const getEmployeeSalary = async (req: Request, res: Response) => {
  try {
    const cardID = req.query.cardID
      ? parseInt(req.query.cardID as string)
      : null;
    const departmentID = req.query.departmentID
      ? parseInt(req.query.departmentID as string)
      : null;

    if (!cardID || !departmentID) {
      res.status(400).json({ message: "cardID and departmentID are required" });
    } else {
      const result = await pool.query(
        `SELECT * FROM obtenerdatosalarialcolaborador($1, $2)`,
        [cardID, departmentID]
      );
      if (!result || result.rowCount === 0) {
        res.status(404).json({
          message: "No salary data found for this employee and department",
        });
      } else {
        res.status(200).json(result.rows[0]);
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting salary data");
  }
};

/**
 * Controller to create a new department.
 *
 * This method receives the department name from the request body
 * and inserts it into the database using a stored procedure.
 * If the department name is missing or already exists, an error response will be sent.
 *
 * @async
 * @function createDepartment
 * @param {Request} req - Express request object, containing department data in req.body.
 * @param {Response} res - Express response object, used to send responses to the client.
 *
 * @throws {Error} 409 - If the department name is missing or already exists in the database.
 * @throws {Error} 500 - If an unexpected error occurs while creating the department.
 *
 * @returns {void} Does not return a value, sends a JSON response with the operation status.
 */

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { departmentName } = req.body;

    if (!departmentName) {
      res
        .status(400)
        .json({ message: "El nombre del departamento es requerido" });
    } else {
      await pool.query('CALL "insertdepartamento"($1)', [departmentName]);
      res.status(201).json({ message: "Departamento creado correctamente" });
    }
  } catch (err: any) {
    if (err.code === "45000") {
      res.status(409).json({ message: "El nombre del departamento ya existe" });
    } else {
      res.status(500).json({
        message: "Error al crear el departamento",
        error: err.message,
      });
    }
  }
};

/**
 * Controller to assign a salary to a department.
 *
 * This method receives department ID, salary, children quantity, spouse status, and optional
 * contribution percentage for the association from the request body, and assigns the salary
 * using a stored procedure. Validations are performed to ensure that the department ID and
 * salary are valid, and that the contribution percentage, if provided, is within the allowed range.
 *
 * @async
 * @function setSalary
 * @param {Request} req - Express request object, containing salary data in req.body.
 * @param {Response} res - Express response object, used to send responses to the client.
 *
 * @throws {Error} 400 - If the department ID is missing, salary is invalid, or contribution percentage is out of range.
 * @throws {Error} 500 - If an unexpected error occurs while assigning the salary to the department.
 *
 * @returns {void} Does not return a value, sends a JSON response with the operation status.
 */
export const setSalary = async (req: Request, res: Response) => {
  try {
    const {
      departmentID,
      salary,
      childrenQuantity,
      hasSpouse,
      contributionPercentage,
    } = req.body;

    const departmentIdNumber = departmentID
      ? parseInt(departmentID as string, 10)
      : null;
    const salaryNumber = salary ? parseFloat(salary as string) : null;
    const childrenNumber = childrenQuantity
      ? parseInt(childrenQuantity as string, 10)
      : null;
    const contributionNumber = contributionPercentage
      ? parseFloat(contributionPercentage as string)
      : null;

    if (!departmentIdNumber) {
      res.status(400).json({ message: "El ID del departamento es requerido" });
    } else if (salaryNumber !== null && salaryNumber <= 0) {
      res.status(400).json({ message: "El salario debe ser mayor a 0" });
    } else if (
      contributionNumber !== null &&
      (contributionNumber <= 0 || contributionNumber > 5)
    ) {
      res.status(400).json({
        message: "La contribución debe ser mayor a 0 y menor o igual a 5",
      });
    } else {
      await pool.query(
        "CALL asignarSalarioDepartamento($1::SMALLINT, $2::INT, $3::SMALLINT, $4::BOOLEAN, $5::NUMERIC)",
        [
          departmentIdNumber,
          salaryNumber,
          childrenNumber,
          hasSpouse,
          contributionNumber,
        ]
      );
      res
        .status(200)
        .json({ message: "Salario asignado correctamente al departamento" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error al asignar salario al departamento" });
  }
};

/**
 * Controller to assign a salary to an employee in a specific department.
 *
 * This method receives cedula (employee ID), department ID, salary, children quantity,
 * spouse status, and optional contribution percentage for the association from the request body,
 * and assigns the salary using a stored procedure. Validations are performed to ensure that the
 * cedula, department ID, salary, and contribution percentage are valid.
 *
 * @async
 * @function setSalaryByCedula
 * @param {Request} req - Express request object, containing salary data in req.body.
 * @param {Response} res - Express response object, used to send responses to the client.
 *
 * @throws {Error} 400 - If the cedula, department ID, salary is invalid, or contribution percentage is out of range.
 * @throws {Error} 500 - If an unexpected error occurs while assigning the salary to the employee in the department.
 *
 * @returns {void} Does not return a value, sends a JSON response with the operation status.
 */
export const setEmployeeSalary = async (req: Request, res: Response) => {
  try {
    const { cardID } = req.query;
    const {
      departmentID,
      salary,
      childrenQuantity,
      hasSpouse,
      contributionPercentage,
    } = req.body;

    const cardIDNumber = cardID ? parseInt(cardID as string, 10) : null;
    const departmentIdNumber = departmentID
      ? parseInt(departmentID as string, 10)
      : null;
    const salaryNumber = salary ? parseFloat(salary as string) : null;
    const childrenNumber = childrenQuantity
      ? parseInt(childrenQuantity as string, 10)
      : null;
    const contributionNumber = contributionPercentage
      ? parseFloat(contributionPercentage as string)
      : null;

    if (!cardIDNumber) {
      res.status(400).json({ message: "La cédula del empleado es requerida" });
    } else if (!departmentIdNumber) {
      res.status(400).json({ message: "El ID del departamento es requerido" });
    } else if (salaryNumber !== null && salaryNumber <= 0) {
      res.status(400).json({ message: "El salario debe ser mayor a 0" });
    } else if (
      contributionNumber !== null &&
      (contributionNumber <= 0 || contributionNumber > 5)
    ) {
      res.status(400).json({
        message: "La contribución debe ser mayor a 0 y menor o igual a 5",
      });
    } else {
      await pool.query(
        "CALL asignarsalarioporcedula($1::INTEGER, $2::SMALLINT, $3::INT, $4::SMALLINT, $5::BOOLEAN, $6::NUMERIC)",
        [
          cardIDNumber,
          departmentIdNumber,
          salaryNumber,
          childrenNumber,
          hasSpouse,
          contributionNumber,
        ]
      );
      res.status(200).json({
        message:
          "Salario asignado correctamente al empleado en el departamento",
      });
    }
  } catch (err: any) {
    if (err.code === "P0001") {
      res.status(400).json({
        message: `El colaborador con la cédula ${req.query.cardID} no esta registrado en el departamento`,
      });
    } else {
      res.status(500).json({
        message: "Error al asignar salario al empleado en el departamento",
        error: err.message,
      });
    }
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
export const insertEmployeesIntoDepartment = async (
  req: Request,
  res: Response
) => {
  try {
    // Extract depNombre from query parameters
    const { departamentoId, empleados } = req.body;

    // Check if departamentoId is provided and empleados is a valid array with at least one element
    if (departamentoId && Array.isArray(empleados) && empleados.length > 0) {
      // Call the stored procedure to assign salaries to employees in the department
      await pool.query("CALL insertEmpleadosDepartamentos($1, $2)", [
        departamentoId,
        empleados,
      ]);
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
