// JDInput.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  buildGeminiPrompt,
  resumeTemplate,
  coverLetterTemplate,
  coldEmailTemplate,
  buildLinkedInMessagePrompt,
  buildCoverLetterUpdatePrompt,
  buildCompanyAndEmailPrompt,
  buildGeminiPromptForJD,
  buildFitForRolePrompt,
} from "../utils/promptBuilder";
import {
  callGeminiAPIforJD,
  callGeminiAPI,
  callGeminiAPIForLinkedInMessage,
  callGeminiAPIForCoverLetterUpdate,
  callGeminiAPIForCompanyAndEmail,
  callGeminiAPIForFitExplanation,
} from "../utils/apiHandler";
import {
  sanitizeLatexContent,
  sanitizeSkillsLatex,
} from "../utils/latexSanitizer";
import "../CSS/JDInput.css";
import { useResume } from "../context/ResumeContext"; // ✅ Add this
// Add this import with your other imports
import ColdEmailSender from "../components/ColdEmailSender";

// import { whyIFitService } from "../services/api";

// Add these imports at the top of JDInput.js
import EmailStatsWidget from "../components/EmailStatsWidget";
import "../CSS/EmailStatsWidget.css";

function JDInput({ onJDUpdate }) {
  // 🌐 Routing
  const navigate = useNavigate();

  // 🔐 Authentication check
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn");
    if (isLoggedIn !== "true") {
      navigate("/login");
    }
  }, []);

  const {
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
    FinalResumeLatex,
    setFinalResumeLatex,
    changes,
    setChanges,
    coverLetter,
    setCoverLetter,
    coldEmail,
    setColdEmail,
    linkedinMessage,
    setLinkedinMessage,
  } = useResume();

  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [latexResume, setLatexResume] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [jobResult, setJobResult] = useState("");
  const [showJobModal, setShowJobModal] = useState(false);
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [coverLetterContent, setCoverLetterContent] = useState(
    `Your default content here...`
  );
  const [fitExplanation, setFitExplanation] = useState("");
  // Add these state variables in your JDInput component
  const [emailStats, setEmailStats] = useState({});
  const [emailReminders, setEmailReminders] = useState([]);
  // Add this function to handle stats updates
  const handleEmailStatsUpdate = (data) => {
    setEmailStats(data.stats || {});
    setEmailReminders(data.reminders || []);
  };

  const [jobCount, setJobCount] = useState(() => {
    const saved = localStorage.getItem("jobCounter");
    return saved ? parseInt(saved) : 1;
  });
  const handleNextJob = () => {
    const newCount = jobCount + 1;
    localStorage.setItem("jobCounter", newCount);
    setJobCount(newCount);
    window.location.reload(); // Refresh page to start over
  };

  const formattedCoverLetter = coverLetter
    .replace(/\n\n/g, "<p>")
    .replace(/\n/g, "<br>");

  // 📅 Format today's date
  const todayDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const subjectMatch = coldEmail.match(/Subject:\s*(.*)/i);
    setEmailSubject(subjectMatch ? subjectMatch[1].trim() : "");
    setEmailBody(coldEmail.replace(/Subject:.*\n?/i, "").trim());
  }, [coldEmail]);

  // Toast message function
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000); // toast disappears in 3 seconds
  };

  // 📥 Copyable Content Box Renderer
  const renderBox = (title, content) => (
    <div className="content-box">
      <h3>{title}</h3>
      <textarea rows="8" value={content} readOnly className="textarea" />
      <button
        className="copy-btn"
        onClick={() => {
          navigator.clipboard.writeText(content);
        }}
      >
        Copy the text
      </button>
    </div>
  );

  // 💡 Feature Functions
  const handleJD = async () => {
    if (!jobDesc.trim()) return;
    setLoading(true);
    if (onJDUpdate) onJDUpdate(jobDesc);
    const prompt = buildGeminiPromptForJD({
      jobDescription: jobDesc,
      resumeTemplate: resumeTemplate.full,
    });
    const result = await callGeminiAPIforJD(prompt);
    setJobResult(result.result || "");
    setLoading(false);
    setShowJobModal(true);
  };

  const handleGenerate = async () => {
    console.log("handleGenerate called");
    if (!jobDesc.trim()) return;
    setLoading(true);

    try {
      // 1️⃣ Check if Job Description already exists in DB
      const jdCheckResponse = await fetch("http://localhost:5001/check-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jobDesc }), // only JD here
      });
      const jdCheckResult = await jdCheckResponse.json();
      if (jdCheckResponse.status === 200 && jdCheckResult.exists) {
        alert("⚠️ This job description already exists in DB!");
        setLoading(false);
        return;
      }
      // 2️⃣ If JD is new → call Gemini
      if (onJDUpdate) onJDUpdate(jobDesc);
      const prompt = buildGeminiPrompt({
        jobDescription: jobDesc,
        resumeTemplate: resumeTemplate.full,
        coverLetterTemplate,
        coldEmailTemplate,
      });
      const result = await callGeminiAPI(prompt);
      // Extract company name from Gemini response
      const extractedCompany = result.companyName || "";
      setCompanyName(extractedCompany);

      // 3️⃣ Now check if companyName already exists in DB
      if (extractedCompany) {
        const companyCheckResponse = await fetch(
          "http://localhost:5001/check-job",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ companyName: extractedCompany }), // only company
          }
        );

        const companyCheckResult = await companyCheckResponse.json();
        if (companyCheckResponse.status === 200 && companyCheckResult.exists) {
          // ⚠️ Ask user if they want to continue anyway
          const continueAnyway = window.confirm(
            `⚠️ You already applied to ${extractedCompany}.\nDo you want to continue generating anyway?`
          );
          if (!continueAnyway) {
            setLoading(false);
            return; // ⛔ Stop if user cancels
          }
        }
      }

      // setCompanyName(result.companyName || "");
      setSummaryLatex(sanitizeLatexContent(result.summaryLatex || ""));
      setSkillsLatex(result.skillsLatex || "");
      setMetlifeLatex(sanitizeLatexContent(result.metlifeLatex || ""));
      setAdonsLatex(sanitizeLatexContent(result.adonsLatex || ""));
      setChanges(result.changes || ""); // Set changes from the result
      setCoverLetter(sanitizeLatexContent(result.coverLetter || ""));
      setColdEmail(result.coldEmail || "");
      setFinalResumeLatex(sanitizeLatexContent(result.FinalResumeLatex || ""));
    } catch (error) {
      console.error("❌ Error in handleGenerate:", error);
      alert("❌ Failed to generate tailored content.");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInMessage = async () => {
    if (!jobDesc.trim()) return;
    // console.log(
    //   "🚀 ~ file: JDInput.js:88 ~ handleLinkedInMessage ~ jobDesc:",
    //   jobDesc
    // );
    setLoading(true);
    const prompt = buildLinkedInMessagePrompt({
      jobDescription: jobDesc,
      resumeTemplate: resumeTemplate.full,
    });
    const result = await callGeminiAPIForLinkedInMessage(prompt);
    // console.log("the result in jdinput file is ", result);
    setLinkedinMessage(result.linkedinMessage || "");
    setLoading(false);
  };

  const handleCoverLetterUpdate = async () => {
    // console.log(
    //   "the handle cover letter update is called in jd input function"
    // );
    if (!jobDesc.trim()) return;
    setLoading(true);

    const prompt = buildCoverLetterUpdatePrompt({
      jobDescription: jobDesc,
      resumeTemplate: resumeTemplate.full,
      coverLetterTemplate,
      todayDate,
    });
    // console.log("the prompt in jd input file is ", prompt);

    const { updatedCoverLetter } = await callGeminiAPIForCoverLetterUpdate(
      prompt
    );
    // console.log("the updated cover letter is ", updatedCoverLetter);

    setLoading(false);
    navigate("/cover-letter-update", {
      state: {
        template: coverLetterTemplate,
        updated: updatedCoverLetter,
      },
    });
  };

  const handleCompanyNameExtraction = async () => {
    const prompt = buildCompanyAndEmailPrompt(jobDesc);
    const company = await callGeminiAPIForCompanyAndEmail(prompt);
    // console.log("🧾 Company Extracted:", company);
  };

  const handleSaveToDB = async () => {
    const payload = {
      applyDate: new Date().toISOString().split("T")[0],
      companyName,
      summaryLatex,
      skillsLatex,
      metlifeLatex,
      adonsLatex,
      changes,
      coverLetter,
      coldEmail,
      finalResumeLatex: FinalResumeLatex,
      jobDescription: jobDesc, // Include job description in payload
    };

    try {
      const response = await fetch("http://localhost:5001/save-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      // console.log("✅ Backend Response:", result);
      if (response.status === 200) {
        alert("✅ Saved to DB successfully!");
      } else if (response.status === 409) {
        alert("⚠️ This data already exists in the database.");
      } else {
        alert(`❌ Unexpected error: ${result.message || "Unknown error"}`);
      }

      // alert("✅ Saved to DB successfully!");
    } catch (error) {
      console.error("❌ Error saving to DB:", error);
      alert("❌ Failed to save to DB.");
    }
  };

  const handleSendEmail = async () => {
    const to = document.querySelector(".gmail-to").value;
    const subject = emailSubject;
    const text = emailBody;
    const fileInput = document.querySelector(".gmail-attachment");

    let attachmentBase64 = "";
    let attachmentName = "";

    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      attachmentName = file.name;

      const reader = new FileReader();
      reader.onload = async () => {
        // Strip the base64 prefix (e.g., "data:application/pdf;base64,...")
        attachmentBase64 = reader.result.split(",")[1];

        try {
          setEmailSending(true);
          const res = await fetch("http://localhost:5001/send-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to,
              subject,
              text,
              attachmentName,
              attachmentBase64,
            }),
          });

          const data = await res.json();
          if (res.ok) {
            // alert("📨 Email sent successfully!");
            showToast("📨 Email sent successfully!");

            setShowEmailModal(false);
          } else {
            // alert("❌ Failed to send email: " + data.message);
            showToast("❌ Failed: " + data.error);
          }
        } catch (err) {
          showToast("❌ Network error: " + err.message);
        } finally {
          setEmailSending(false); // ✅ stop spinner
        }
      };
      reader.readAsDataURL(file); // Triggers reader.onload above
    } else {
      // No attachment, just send email
      try {
        setEmailSending(true);
        const res = await fetch("http://localhost:5001/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ to, subject, text }), // no attachment
        });

        const data = await res.json();
        if (res.ok) {
          showToast("📨 Email sent successfully!");
          // alert("📨 Email sent successfully!");
          setShowEmailModal(false);
        } else {
          showToast("❌ Failed: " + data.message);
        }
      } catch (err) {
        showToast("❌ Network error: " + err.message);
      } finally {
        setEmailSending(false); // ✅ stop spinner
      }
    }
  };

  const handleGoToResumeGenerator = () => {
    // Navigate to resume generation component with the generated data
    navigate("/resume-generation", {
      state: {
        resumeData: {
          PROFESSIONAL_SUMMARY: summaryLatex,
          TECHNICAL_SKILLS: skillsLatex,
          METLIFE_BULLET_POINTS: metlifeLatex,
          ADONS_BULLET_POINTS: adonsLatex,
        },
        jobDescription: jobDesc,
        companyName: companyName,
      },
    });
  };

  const handleFitExplanation = async () => {
    if (!jobDesc.trim()) return;
    setLoading(true);
    const prompt = buildFitForRolePrompt({
      jobDescription: jobDesc,
      resumeLatex: FinalResumeLatex || resumeTemplate.full,
    });

    const result = await callGeminiAPIForFitExplanation(prompt);
    setFitExplanation(result.fitExplanation || "");
    setLoading(false);
  };

  // Replace your handleWhyIFitGeneration function with this:
  const handleWhyIFitGeneration = async () => {
    if (!jobDesc.trim()) {
      alert("Please enter a job description first");
      return;
    }

    if (!fitExplanation.trim()) {
      alert(
        "Please click 'Why I Fit This Role' button first to generate AI analysis"
      );
      return;
    }

    // Navigate to the Why I Fit generation page with the data
    navigate("/why-i-fit-generation", {
      state: {
        whyIFitData: fitExplanation,
        companyName: companyName,
        jobDescription: jobDesc,
      },
    });
  };
  const handleGmailManager = () => {
    navigate("/gmail-manager");
  };
  // / Add this function to refresh Gmail and update stats
  const handleGmailRefresh = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/emails/fetch-gmail",
        {
          method: "POST",
        }
      );
      const result = await response.json();

      if (result.success) {
        showToast("Gmail emails fetched successfully!");
        // Refresh the email stats widget
        window.location.reload(); // Or trigger a re-render of EmailStatsWidget
      } else {
        showToast("Error fetching Gmail: " + result.message);
      }
    } catch (error) {
      showToast("Gmail fetch error: " + error.message);
    }
  };

  return (
    <div className="jd-wrapper">
      <header className="header">
        <h1>ResuMe</h1>
        <p>
          <strong>Resume Update | Cover Letter | Cold Mail</strong>
        </p>
        <button
          onClick={() => {
            localStorage.removeItem("loggedIn");
            navigate("/login");
          }}
        >
          🚪 Logout
        </button>
      </header>
      {/* ✅ Toast & Spinner */}
      {toastMsg && <div className="toast-message">{toastMsg}</div>}
      {emailSending && <div className="spinner"></div>}
      <div className="main">
        <div className="left-panel">
          <h2>Job Description</h2>
          <textarea
            className="textarea jd-input"
            rows="6"
            placeholder="Paste job description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />
          <div className="button-container">
            <button onClick={handleJD} disabled={loading}>
              {loading ? "Checking Job..." : "Job Matching/Unmatching"}
            </button>

            <button onClick={handleGenerate} disabled={loading}>
              {loading ? "Generating..." : "Generate Tailored Content"}
            </button>

            <button
              className="linkedin-btn"
              onClick={handleLinkedInMessage}
              disabled={loading}
            >
              💬 Generate LinkedIn Message
            </button>
            <button onClick={() => navigate("/ats-analysis")}>
              🔍 Compare Resume with JD (ATS Score)
            </button>
            <button onClick={handleCoverLetterUpdate} disabled={loading}>
              ✉️ Generate Cover Letter
            </button>
            <button onClick={handleCompanyNameExtraction}>
              🧾 Get Company Name
            </button>
            <button onClick={handleSaveToDB} disabled={loading}>
              💾 Save to Database
            </button>
            {summaryLatex && skillsLatex && metlifeLatex && adonsLatex && (
              <button
                onClick={handleGoToResumeGenerator}
                className="resume-generator-btn"
              >
                🎯 Go to Resume Generation
              </button>
            )}

            <button onClick={handleFitExplanation} disabled={loading}>
              Why I Fit This Role
            </button>
          </div>

          {jobResult && (
            <div className="overlay">
              <div className="modal job-analysis-modal">
                <button className="close-btn" onClick={() => setJobResult("")}>
                  ×
                </button>
                <h2>🧠 Job Compatibility Analysis</h2>
                <div className="modal-content">
                  {jobResult.split(/\*\*(.*?)\*\*/g).map((chunk, index) =>
                    index % 2 === 1 ? (
                      <h4 key={index} className="highlight-heading">
                        {chunk}
                      </h4>
                    ) : (
                      <p key={index}>{chunk}</p>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {linkedinMessage &&
            renderBox("LinkedIn Message to Recruiter", linkedinMessage)}

          <div className="mini-grid">
            {renderBox("Changes Made", changes)}

            {renderBox("Summary", summaryLatex)}
            {renderBox("Tech Skills", skillsLatex)}
            {renderBox("Met Life Work Exp", metlifeLatex)}
            {renderBox("Adons Work Exp", adonsLatex)}
            {renderBox("Final Resume", FinalResumeLatex)}
          </div>
        </div>

        <div className="right-panel">
          <div className="company-name-input">
            <h3>Company Name</h3>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "1rem",
                width: "220px",
              }}
            />
          </div>

          <div className="job-counter-container">
            {/* <span className="job-counter">🧾 Job #{jobCount}</span> */}
            <h4>No of Jobs Applied: {jobCount}</h4>
            <button className="jobCounterButton" onClick={handleNextJob}>
              ➕ Next Job
            </button>
            <button
              className="jobCounterButton"
              onClick={() => {
                localStorage.removeItem("jobCounter");
                window.location.reload();
              }}
            >
              Reset Counter
            </button>
          </div>

          <button className="gmailManagerButton" onClick={handleGmailManager}>
            <h2>Gmail Manager</h2>
          </button>
          <EmailStatsWidget onStatsUpdate={handleEmailStatsUpdate} />
          {renderBox("CoverLetter For Given Job", coverLetter)}

          <button
            onClick={() => {
              if (coverLetter) {
                navigate("/cover-letter-generation", {
                  state: {
                    coverLetterData: coverLetter,
                    companyName: companyName,
                    jobDescription: jobDesc,
                  },
                });
              } else {
                alert("Please generate cover letter content first!");
              }
            }}
            className="edit-cover-letter-btn"
          >
            ✏️ Edit & Generate Cover Letter PDF
          </button>

          {fitExplanation &&
            renderBox("🧠 Why I Fit This Role", fitExplanation)}

          <button onClick={handleWhyIFitGeneration}>
            📄 Edit & Generate Why I Fit Document
          </button>

          {renderBox("ColdMail For Given Job", coldEmail)}
          {coldEmail && (
            <ColdEmailSender coldEmail={coldEmail} companyName={companyName} />
          )}
        </div>
      </div>
      {/* 📄 Resume Paste Modal (LaTeX Resume Modal) */}
      {showModal && (
        <div className="gmail-overlay">
          <div className="gmail-compose-box">
            <div className="gmail-header">
              <span>Paste Your Full LaTeX Resume</span>
              <div className="gmail-icons">
                <span title="Minimize">—</span>
                <span title="Full screen">⧉</span>
                <span
                  className="gmail-close"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </span>
              </div>
            </div>
            <textarea
              rows="12"
              value={latexResume}
              onChange={(e) => setLatexResume(e.target.value)}
              placeholder="Paste your full LaTeX resume code here..."
              className="gmail-body"
            />
            <div className="gmail-footer">
              <button
                className="gmail-send"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="gmail-send"
                onClick={() => {
                  // console.log("Submitted Resume:", latexResume);
                  setShowModal(false);
                }}
              >
                Submit for Comparison
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 📧 Gmail Compose Cold Email Modal */}
      {showEmailModal && (
        <div className="gmail-overlay">
          <div className="gmail-compose-box">
            <div className="gmail-header">
              <span>New Message</span>
              <div className="gmail-icons">
                <span title="Minimize">—</span>
                <span title="Full screen">⧉</span>
                <span
                  className="gmail-close"
                  onClick={() => setShowEmailModal(false)}
                >
                  ×
                </span>
              </div>
            </div>

            <div className="gmail-fields">
              <input type="text" className="gmail-to" placeholder="To" />
              <input
                type="text"
                className="gmail-subject"
                placeholder="Subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
              <textarea
                className="gmail-body"
                rows="10"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
              />
              <input type="file" className="gmail-attachment" />
            </div>

            <div className="gmail-footer">
              <button
                className="gmail-send"
                onClick={handleSendEmail}
                disabled={emailSending}
              >
                {emailSending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JDInput;
