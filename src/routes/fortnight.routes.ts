// Express
import { Router } from "express";
// Controllers
import { insertFortnight } from "../controllers";

// Router
const router = Router();

// Department routes
router.post("/", insertFortnight);

export default router;
