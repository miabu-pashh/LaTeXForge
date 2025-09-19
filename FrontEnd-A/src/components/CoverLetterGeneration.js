// src/components/CoverLetterGeneration.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/CoverLetterGeneration.css";

function CoverLetterGeneration() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the data passed from JDInput
  const { coverLetterData, companyName, jobDescription } = location.state || {};

  // State for selected field
  const [selectedField, setSelectedField] = useState("DATE");

  // State for editable content
  const [editableData, setEditableData] = useState({
    DATE: "",
    COMPANY_NAME: "",
    COMPANY_ADDRESS: "",
    SALUTATION: "Hiring Manager",
    CONTENT: "",
  });

  // State for PDF generation
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);

  const fieldLabels = {
    DATE: "Date",
    COMPANY_NAME: "Company Name",
    COMPANY_ADDRESS: "Company Address",
    SALUTATION: "Salutation",
    CONTENT: "Letter Content",
  };

  // Initialize data when component mounts
  useEffect(() => {
    if (coverLetterData) {
      // Parse the cover letter data to extract different parts
      const lines = coverLetterData.split("\n");

      // Try to extract date (usually the first line after header)
      const datePattern = /^[A-Z][a-z]+ \d{1,2}, \d{4}$/;
      let extractedDate = "";
      let extractedCompanyName = companyName || "";
      let extractedCompanyAddress = "";
      let extractedSalutation = "Hiring Manager";
      let contentStartIndex = 0;

      // Find the date
      for (let i = 0; i < lines.length; i++) {
        if (datePattern.test(lines[i].trim())) {
          extractedDate = lines[i].trim();

          // Company name is usually after date
          if (lines[i + 1] && lines[i + 1].includes("Hiring Manager")) {
            extractedSalutation = "Hiring Manager";
            contentStartIndex = i + 2;
          } else if (lines[i + 1]) {
            // Extract company info
            extractedCompanyName = lines[i + 1].trim() || companyName || "";
            extractedCompanyAddress = lines[i + 2] ? lines[i + 2].trim() : "";

            // Find salutation (usually starts with "Dear")
            for (let j = i + 1; j < lines.length; j++) {
              if (lines[j].startsWith("Dear ")) {
                extractedSalutation = lines[j]
                  .replace("Dear ", "")
                  .replace(",", "")
                  .trim();
                contentStartIndex = j + 1;
                break;
              }
            }
          }
          break;
        }
      }

      // Extract the main content (everything after salutation until signature)
      let mainContent = "";
      for (let i = contentStartIndex; i < lines.length; i++) {
        if (
          lines[i].includes("Warm regards") ||
          lines[i].includes("Sincerely") ||
          lines[i].includes("Best regards")
        ) {
          break;
        }
        if (lines[i].trim()) {
          mainContent += lines[i] + "\n\n";
        }
      }

      setEditableData({
        DATE:
          extractedDate ||
          new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        COMPANY_NAME: extractedCompanyName,
        COMPANY_ADDRESS: extractedCompanyAddress,
        SALUTATION: extractedSalutation,
        CONTENT: mainContent.trim(),
      });

      setMessage("✅ Cover letter loaded! Edit and generate PDF.");
    } else {
      setMessage(
        "❌ No cover letter data found. Please generate content first."
      );
    }
  }, [coverLetterData, companyName]);

  // Handle field change
  const handleFieldChange = (field, value) => {
    setEditableData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Generate PDF using Spring Boot backend
  const handleGeneratePDF = async () => {
    if (!editableData.CONTENT) {
      setMessage("❌ Please add content before generating PDF");
      return;
    }

    setIsLoading(true);
    setMessage("⏳ Generating your cover letter PDF...");

    try {
      // Prepare data for backend with correct field names
      const requestData = {
        COVER_LETTER_DATE: editableData.DATE,
        COMPANY_NAME: editableData.COMPANY_NAME,
        COMPANY_ADDRESS: editableData.COMPANY_ADDRESS,
        SALUTATION: editableData.SALUTATION,
        CONTENT: editableData.CONTENT,
      };

      console.log("📤 Sending to backend:", requestData);

      const response = await axios.post(
        "http://localhost:8080/api/resume/generate-cover-letter",
        requestData,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Create blob and URL for viewing
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      setPdfUrl(url);
      setMessage("✅ Cover letter PDF generated successfully!");
    } catch (error) {
      console.error("❌ Error generating PDF:", error);
      setMessage(
        "❌ Error generating PDF. Make sure the backend is running on port 8080."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;

      // 👇 Custom filename using company name
      const company = editableData.COMPANY_NAME || "Company";
      const fileName = `CoverLetter${company.replace(/\s+/g, "")}.pdf`;

      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setMessage("📄 PDF downloaded successfully!");
    }
  };

  // Print PDF
  const handlePrintPDF = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl, "_blank");
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return (
    <div>
      {/* Header - Same as Resume Generation */}
      <header className="cl-header">
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

      <div className="cover-letter-container">
        {/* Left Panel - Field Selection */}
        <div className="cl-left-panel">
          <h2>Cover Letter Fields</h2>
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

        {/* Middle Panel - Editor */}
        <div className="cl-middle-panel">
          <h2>{fieldLabels[selectedField]}</h2>
          {selectedField === "CONTENT" ? (
            <textarea
              value={editableData[selectedField] || ""}
              onChange={(e) => handleFieldChange(selectedField, e.target.value)}
              rows={20}
              placeholder="Edit your cover letter content here..."
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

        {/* Right Panel - PDF Preview */}
        <div className="cl-right-panel">
          <div className="cl-preview-header">
            <h2>Cover Letter Preview</h2>
            {pdfUrl && (
              <button onClick={handleDownloadPDF} className="action-btn">
                💾 Download
              </button>
            )}
          </div>
          {/* <h2>Cover Letter Preview</h2> */}
          {pdfUrl ? (
            <>
              {/* <div className="pdf-actions">
                <button onClick={handleDownloadPDF} className="action-btn">
                  💾 Download
                </button>
              </div> */}
              <iframe
                src={pdfUrl}
                title="Cover Letter PDF"
                frameBorder="0"
                width="100%"
                height="100%"
              />
            </>
          ) : (
            <div className="no-preview">
              <p>No cover letter generated yet</p>
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
          <p>Generating your cover letter PDF...</p>
        </div>
      )}
    </div>
  );
}

export default CoverLetterGeneration;
