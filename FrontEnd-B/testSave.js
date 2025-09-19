// testSave.js
import axios from "axios";

const testData = {
  applyDate: new Date().toISOString(), // ✅ renamed
  companyName: "OpenAI",
  summaryLatex: "Summary latex here...",
  skillsLatex: "Skills latex here...",
  metlifeLatex: "MetLife experience latex...",
  adonsLatex: "Adons experience latex...",
  changes: "Some changes made...",
  coverLetter: "Cover letter text...",
  coldEmail: "Cold email text...",
  finalResumeLatex: "Final latex code...",
  jobDescription: "Job description text...",
};

axios
  .post("http://localhost:5001/save-data", testData, {
    headers: { "Content-Type": "application/json" },
  })
  .then((res) => {
    console.log("✅ Response from backend:", res.data);
  })
  .catch((err) => {
    console.error("❌ Error testing /save-data:", err.message);
  });
