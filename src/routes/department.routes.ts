import { Router } from "express";
import { create } from "../controllers";
const router = Router();

// Create department routes
router.post("/d", create);

export default router;
