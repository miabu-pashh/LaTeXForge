// Updated App.js with diff viewer for resume changes
import React, { useState } from "react";
import JDInput from "./components/JDInput";
import "./App.css";
import ATSAnalysis from "./components/ATSAnalysis";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login"; // <- new
import WelcomePage from "./components/WelcomePage"; // <- new
import ResumeGeneration from "./components/ResumeGeneration"; // <- add this
import { ResumeProvider } from "./context/ResumeContext"; // ✅ Import

import CoverLetterGeneration from "./components/CoverLetterGeneration";
import WhyIFitGeneration from "./components/WhyIFitGeneration";
import EmailManagerDashboard from "./components/EmailManagerDashboard";
function App() {
  const [activeTab, setActiveTab] = useState("resume");
  const [jobDescription, setJobDescription] = useState("");
  const [originalResume, setOriginalResume] = useState("");
  const [updatedResume, setUpdatedResume] = useState("");
  const [originalLatex, setOriginalLatex] = useState("");
  const [updatedLatex, setUpdatedLatex] = useState("");

  return (
    <ResumeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />

          <Route path="/login" element={<Login />} />
          <Route
            path="/jdinput"
            element={<JDInput onJDUpdate={setJobDescription} />}
          />
          <Route
            path="/ats-analysis"
            element={<ATSAnalysis jobDesc={jobDescription} />}
          />
          <Route path="/resume-generation" element={<ResumeGeneration />} />
          <Route
            path="/cover-letter-generation"
            element={<CoverLetterGeneration />}
          />
          <Route path="/why-i-fit-generation" element={<WhyIFitGeneration />} />
          <Route path="/gmail-manager" element={<EmailManagerDashboard />} />
        </Routes>
      </Router>
    </ResumeProvider>
  );
}

export default App;
