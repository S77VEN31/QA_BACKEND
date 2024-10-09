// Express
import { Router } from "express";
// Controllers
import { login, register } from "../controllers/auth.controller";

// Router
const router = Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);

export default router;
