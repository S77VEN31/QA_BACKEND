// Bcrypt
import bcrypt from "bcryptjs";
// Express
import { Request, Response } from "express";
// JWT
import jwt from "jsonwebtoken";
// Database
import { pool } from "../database";

const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `SELECT public.register_user($1, $2, $3) AS user_id`,
      [username, email, hashedPassword]
    );

    const token = jwt.sign(
      { id: result.rows[0].user_id },
      process.env.JWT_SECRET || "token",
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(`SELECT * FROM authenticate_user($1)`, [
      email,
    ]);

    if (result.rows.length === 0) {
      res.status(400).send("Invalid credentials");
    } else {
      const validPassword = await bcrypt.compare(
        password,
        result.rows[0].p_password_hash
      );

      if (!validPassword) {
        res.status(400).send("Invalid credentials");
      } else {
        const token = jwt.sign(
          { id: result.rows[0].p_user_id },
          process.env.JWT_SECRET || "token",
          // expire in 1 minute
          { expiresIn: "1h" }
        );
        res.json({ token });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

export { login, register };

