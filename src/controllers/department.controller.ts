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
