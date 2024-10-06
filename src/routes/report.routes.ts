// Express
import { Router } from "express";
// Controllers
import { getReportDetail, getReportTotal } from "../controllers";

// Router
const router = Router();

// Report routes
router.get("/detail", getReportDetail);
router.get("/total", getReportTotal);

export default router;
