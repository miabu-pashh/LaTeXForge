// Resume-BackEnd/saveData.js
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new pg.Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});
export async function saveToDatabase(data) {
  console.log("📦 saveData.js: Running with data:", data);

  const {
    applyDate,
    companyName,
    summaryLatex,
    skillsLatex,
    metlifeLatex,
    adonsLatex,
    changes,
    coverLetter,
    coldEmail,
    finalResumeLatex,
    jobDescription, // Added jobDescription
  } = data;
  const values = [
    applyDate,
    companyName,
    summaryLatex,
    skillsLatex,
    metlifeLatex,
    adonsLatex,
    changes,
    coverLetter,
    coldEmail,
    finalResumeLatex,
    jobDescription,
  ];

  try {
    console.log("🔍 Validating input data...");

    // Check if all fields are empty
    if (values.every((value) => !value) && values.jobDescription === "") {
      console.log("⚠️ All fields are empty. Cannot insert.");
      throw new Error("EMPTY_FIELDS");
    }

    console.log("🔍 Checking for existing entry...");

    const checkQuery = `
      SELECT id FROM generated_data
      WHERE summary_latex = $1 AND skills_latex = $2
        AND metlife_latex = $3 AND adons_latex = $4
        AND final_resume_latex = $5
    `;

    const checkResult = await pool.query(checkQuery, [
      summaryLatex,
      skillsLatex,
      metlifeLatex,
      adonsLatex,
      finalResumeLatex,
    ]);

    if (checkResult.rows.length > 0) {
      console.log("⚠️ Duplicate found. Skipping insert.");
      throw new Error("DUPLICATE_ENTRY");
    }

    const insertQuery = `
      INSERT INTO generated_data (
        apply_date, company_name, summary_latex, skills_latex, 
        metlife_latex, adons_latex, changes, 
        cover_letter, cold_email, final_resume_latex, job_description
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    `;

    await pool.query(insertQuery, values);
    console.log("✅ Inserted into database successfully.");
  } catch (err) {
    if (err.message === "DUPLICATE_ENTRY") {
      throw new Error("DUPLICATE_ENTRY");
    }
    if (err.message === "EMPTY_FIELDS") {
      throw new Error("EMPTY_FIELDS");
    }
    console.error("❌ PG Insert Error:", err);
    throw err;
  }
}

export async function fetchFromDatabase() {
  const query = "SELECT * FROM generated_data";
  try {
    const result = await pool.query(query);
    console.log("✅ Fetched data successfully.");
    return result.rows;
  } catch (error) {
    console.error("❌ PG Fetch Error:", error);
    throw error;
  }
}

export { pool }; // Export the pool for direct queries
