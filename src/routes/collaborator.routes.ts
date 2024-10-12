// Express
import { Router } from "express";
// Controllers
import {
  getCollaboratorName
} from "../controllers";

// Router
const router = Router();

// Department routes
router.get("/", getCollaboratorName);
export default router;
