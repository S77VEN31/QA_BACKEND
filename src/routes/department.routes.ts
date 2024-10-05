import { Router } from "express";
import { create } from "../controllers";
const router = Router();

// Create department routes
router.post("/", create);

export default router;
