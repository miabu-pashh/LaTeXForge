// src/components/WhyIFitGeneration.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/CoverLetterGeneration.css"; // ✅ Reusing same CSS

function WhyIFitGeneration() {
  const location = useLocation();
  const navigate = useNavigate();

  const { whyIFitData, companyName, jobDescription } = location.state || {};

  const [selectedField, setSelectedField] = useState("TARGET_COMPANY");

  const [editableData, setEditableData] = useState({
    TARGET_COMPANY: "",
    TODAY_DATE: "",
    CANDIDATE_NAME: "Mahaboob Pasha Mohammad",
    CANDIDATE_EMAIL: "mahaboobpashamohammad8@gmail.com",
    WHY_I_FIT_CONTENT: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);

  const fieldLabels = {
    TARGET_COMPANY: "Company Name",
    TODAY_DATE: "Date",
    WHY_I_FIT_CONTENT: "Why I Fit Content",
  };

  useEffect(() => {
    if (whyIFitData) {
      setEditableData({
        TARGET_COMPANY: companyName || "",
        TODAY_DATE: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        CANDIDATE_NAME: "Mahaboob Pasha Mohammad",
        CANDIDATE_EMAIL: "mahaboobpashamohammad8@gmail.com",
        WHY_I_FIT_CONTENT: whyIFitData,
      });
      setMessage("✅ Why I Fit content loaded! Edit and generate PDF.");
    } else {
      setMessage("❌ No Why I Fit data found. Please generate content first.");
    }
  }, [whyIFitData, companyName]);

  const handleFieldChange = (field, value) => {
    setEditableData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGeneratePDF = async () => {
    if (!editableData.WHY_I_FIT_CONTENT) {
      setMessage("❌ Please add Why I Fit content before generating PDF");
      return;
    }

    setIsLoading(true);
    setMessage("⏳ Generating your Why I Fit PDF...");

    try {
      const latexResponse = await axios.post(
        "http://localhost:8080/api/why-i-fit/generate",
        {
          jobDescription,
          companyName: editableData.TARGET_COMPANY,
          candidateName: editableData.CANDIDATE_NAME,
          candidateEmail: editableData.CANDIDATE_EMAIL,
          geminiOutput: editableData.WHY_I_FIT_CONTENT,
        }
      );

      const latexContent = latexResponse?.data?.data?.finalLatexContent;

      if (latexResponse.data.status === "success" && latexContent) {
        const pdfResponse = await axios.post(
          "http://localhost:8080/api/resume/generate-why-i-fit-pdf",
          {
            FINAL_LATEX_CONTENT: latexContent,
          },
          {
            responseType: "blob",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const blob = new Blob([pdfResponse.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        setPdfUrl(url);
        setMessage("✅ Why I Fit PDF generated successfully!");
      } else {
        setMessage("❌ Error generating LaTeX document");
      }
    } catch (error) {
      console.error("❌ Error generating PDF:", error);
      setMessage("❌ Error generating PDF. Please check the backend.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleDownloadPDF = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;

      // 👇 Generate custom filename based on company name
      const company = editableData.TARGET_COMPANY || "Company";
      const fileName = `WhyIFitForThisRole(${company.replace(/\s+/g, "")}).pdf`;

      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMessage("📄 PDF downloaded successfully!");
    }
  };

  return (
    <div>
      {/* Header (shared layout) */}
      <header className="cl-header">
        <h1>ResuMe</h1>
        <p>
          <strong>Why I Fit For This Role - Document Generator</strong>
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

      <div className="cover-letter-container">
        {/* Left Panel */}
        <div className="cl-left-panel">
          <h2>Why I Fit Fields</h2>
          <ul className="field-list">
            {Object.keys(fieldLabels).map((field) => (
              <li
                key={field}
                className={selectedField === field ? "active" : ""}
                onClick={() => setSelectedField(field)}
              >
                {fieldLabels[field]}
              </li>
            ))}
            <button
              className="generate-btn"
              onClick={handleGeneratePDF}
              disabled={isLoading}
            >
              {isLoading ? "⏳ Generating..." : "MAKE"}
            </button>
            <button
              className="generate-btn"
              onClick={() => navigate("/jdinput")}
            >
              HOME
            </button>
          </ul>
        </div>

        {/* Middle Panel */}
        <div className="cl-middle-panel">
          <h2>{fieldLabels[selectedField]}</h2>
          {selectedField === "WHY_I_FIT_CONTENT" ? (
            <textarea
              value={editableData[selectedField] || ""}
              onChange={(e) => handleFieldChange(selectedField, e.target.value)}
              rows={20}
              placeholder="Edit your Why I Fit content here..."
            />
          ) : (
            <input
              type="text"
              value={editableData[selectedField] || ""}
              onChange={(e) => handleFieldChange(selectedField, e.target.value)}
              placeholder={`Enter ${fieldLabels[
                selectedField
              ].toLowerCase()}...`}
            />
          )}
          {message && (
            <div
              className={`status ${
                message.includes("✅")
                  ? "success"
                  : message.includes("❌")
                  ? "error"
                  : "info"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="cl-right-panel">
          {/* <h2>Why I Fit Preview</h2> */}

          <div className="cl-preview-header">
            <h2>Why I Fit Preview</h2>
            {pdfUrl && (
              <button onClick={handleDownloadPDF} className="action-btn">
                💾 Download
              </button>
            )}
          </div>

          {/* {pdfUrl && (
            <div className="pdf-actions">
              <button onClick={handleDownloadPDF} className="action-btn">
                💾 Download
              </button>
            </div>
          )} */}
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              title="Why I Fit PDF"
              frameBorder="0"
              width="100%"
              height="100%"
            />
          ) : (
            <div className="no-preview">
              <p>No document generated yet</p>
              <p className="preview-hint">
                Edit fields and click "MAKE" to generate PDF
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
          <p>Generating your Why I Fit PDF...</p>
        </div>
      )}
    </div>
  );
}

export default WhyIFitGeneration;
