// Express
import { Router } from "express";
// Controllers
import {
  createDepartment,
  getDepartments,
  getEmployeeSalary,
  insertEmployeesIntoDepartment,
  setEmployeeSalary,
  setSalary,
} from "../controllers";

// Router
const router = Router();

// Department routes
router.get("/", getDepartments);
router.post("/", createDepartment);
router.patch("/", setSalary);
router.put("/", insertEmployeesIntoDepartment);
router.patch("/employee", setEmployeeSalary);
router.get("/employee", getEmployeeSalary);

export default router;
