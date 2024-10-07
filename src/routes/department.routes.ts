// Express
import { Router } from "express";
// Controllers
import { getDepartments, createDepartment, assignSalaryToDepartment, insertEmployeesIntoDepartment } from "../controllers";

// Router
const router = Router();

// Department routes
router.get("/", getDepartments);
router.post("/", createDepartment);
router.patch("/", assignSalaryToDepartment);
router.put("/", insertEmployeesIntoDepartment);

export default router;
