import { Router } from "express";
import { create } from "../controllers/department.controller";
const router = Router();

// Create department routes
router.post("/", create);

export default router;
