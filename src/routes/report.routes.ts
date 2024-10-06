// Express
import { Router } from "express";
// Controllers
import { getReportDetail } from "../controllers";

// Router
const router = Router();

// Report routes
router.get("/detail", getReportDetail);
router.get("/total");

export default router;
