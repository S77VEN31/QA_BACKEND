// Express
import { Router } from "express";
// Controllers
import { insertFortnight, insertNFortnights } from "../controllers";

// Router
const router = Router();

// Department routes
router.post("/", insertFortnight);
router.put("/", insertNFortnights);

export default router;
