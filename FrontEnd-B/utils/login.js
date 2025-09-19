// Resume-BackEnd/login.js
import pg from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const pool = new pg.Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

export async function validateLogin(email, password) {
  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return { success: false, message: "User not found" };
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return { success: false, message: "Incorrect password" };
    }

    return {
      success: true,
      message: "Login successful",
      user: { id: user.id, email: user.email },
    };
  } catch (err) {
    console.error("Login Error:", err);
    return { success: false, message: "Something went wrong" };
  }
}
