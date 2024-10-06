// Express
import { Router } from "express";
// Controllers
import { getDepartments } from "../controllers";

// Router
const router = Router();

// Department routes
router.get("/", getDepartments);

export default router;
