// Resume-BackEnd/server.js
import express from "express";
import cors from "cors";
import { saveToDatabase, fetchFromDatabase } from "./saveData.js";

import { validateLogin } from "./utils/login.js"; // Import the login validation function

import emailRoutes from "./utils/sendEmail.js"; // Import the email routes
import { pool } from "./saveData.js"; // ✅ Import pool directly
const app = express();
// With this:
app.use(cors());
app.use(express.json({ limit: "10mb" })); // or even "20mb"
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(emailRoutes);

app.post("/save-data", async (req, res) => {
  try {
    await saveToDatabase(req.body);
    res.status(200).json({ message: "Saved successfully" });
  } catch (err) {
    if (err.message === "DUPLICATE_ENTRY") {
      res.status(409).json({ message: "⚠️ Data already exists in database" });
    } else {
      res.status(500).json({ message: "❌ Failed to save data" });
    }
  }
});
app.get("/get-data", async (req, res) => {
  try {
    const data = await fetchFromDatabase();
    console.log("Fetched data:", data);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to retrieve data" });
  }
});

// /added this feature on 07/27/2025 login api

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await validateLogin(email, password);

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(401).json(result);
  }
});
app.post("/check-job", async (req, res) => {
  const { companyName, jobDescription } = req.body;
  console.log("server.js , /check-job triggered:", {
    companyName,
    jobDescription,
  });

  try {
    let query = "";
    let params = [];

    if (jobDescription) {
      query = "SELECT id FROM generated_data WHERE job_description = $1";
      params = [jobDescription];
    } else if (companyName) {
      query = "SELECT id FROM generated_data WHERE company_name = $1";
      params = [companyName];
    } else {
      return res
        .status(400)
        .json({ error: "Missing companyName or jobDescription" });
    }

    const existing = await pool.query(query, params);

    if (existing.rows.length > 0) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (err) {
    console.error("❌ DB check error:", err);
    res.status(500).json({ error: "Database check failed" });
  }
});

app.listen(5001, () => {
  console.log("🚀 Server of maibu running on http://localhost:5001");
});
app.use((req, res) => {
  console.log("❓ Unknown request:", req.method, req.url);
  res.status(404).json({ error: "Not Found" });
});
