// src/context/ResumeContext.js
import React, { createContext, useContext, useState } from "react";

// Create the context
const ResumeContext = createContext();

// Export the hook for convenience
export const useResume = () => useContext(ResumeContext);

// Create the provider
export const ResumeProvider = ({ children }) => {
  const [jobDesc, setJobDesc] = useState("");
  const [summaryLatex, setSummaryLatex] = useState("");
  const [skillsLatex, setSkillsLatex] = useState("");
  const [metlifeLatex, setMetlifeLatex] = useState("");
  const [adonsLatex, setAdonsLatex] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [finalResumeLatex, setFinalResumeLatex] = useState("");
  const [changes, setChanges] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [coldEmail, setColdEmail] = useState("");
  const [linkedinMessage, setLinkedinMessage] = useState("");

  const contextValue = {
    jobDesc,
    setJobDesc,
    summaryLatex,
    setSummaryLatex,
    skillsLatex,
    setSkillsLatex,
    metlifeLatex,
    setMetlifeLatex,
    adonsLatex,
    setAdonsLatex,
    companyName,
    setCompanyName,
    finalResumeLatex,
    setFinalResumeLatex,
    changes,
    setChanges,
    coverLetter,
    setCoverLetter,
    coldEmail,
    setColdEmail,
    linkedinMessage,
    setLinkedinMessage,
  };

  return (
    <ResumeContext.Provider value={contextValue}>
      {children}
    </ResumeContext.Provider>
  );
};
