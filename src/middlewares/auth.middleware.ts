// Express
import { NextFunction, Request, Response } from "express";
// JWT
import jwt from "jsonwebtoken";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access denied, no token provided." });
  }

  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "token");
      (req as any).user = decoded;
      next();
    }
  } catch (error) {
    res.status(403).json({ message: "Invalid token." });
  }
};

export default authenticateToken;
