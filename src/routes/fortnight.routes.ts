// Express
import { Router } from "express";
// Controllers
import {
  insertFortnight,
  insertNFortnights,
  calculateTax,
} from "../controllers";

// Router
const router = Router();

// Department routes
router.post("/", insertFortnight);
router.put("/", insertNFortnights);
router.get("/calculate", calculateTax);

export default router;
