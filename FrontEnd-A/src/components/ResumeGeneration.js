// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "../CSS/ResumeGeneration.css";
// import { useResume } from "../context/ResumeContext"; // ✅ new line

// function ResumeGeneration() {
//   const navigate = useNavigate();

//   const location = useLocation();
//   const { resumeData, companyName } = location.state || {};

//   const [selectedField, setSelectedField] = useState("PROFESSIONAL_SUMMARY");
//   const [editableData, setEditableData] = useState(resumeData || {});
//   const [pdfUrl, setPdfUrl] = useState(null);
//   const [message, setMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const fieldLabels = {
//     PROFESSIONAL_SUMMARY: "Professional Summary",
//     TECHNICAL_SKILLS: "Technical Skills",
//     METLIFE_BULLET_POINTS: "MetLife Experience",
//     ADONS_BULLET_POINTS: "Adons Experience",
//   };

//   const handleFieldChange = (field, value) => {
//     setEditableData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleGeneratePDF = async () => {
//     try {
//       setIsLoading(true);
//       setMessage("⏳ Generating PDF...");
//       const response = await axios.post(
//         "http://localhost:8080/api/resume/generate",
//         editableData,
//         { responseType: "blob" }
//       );
//       const blob = new Blob([response.data], { type: "application/pdf" });
//       const url = URL.createObjectURL(blob);
//       setPdfUrl(url);
//       setMessage("✅ PDF generated successfully!");
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//       setMessage("❌ Failed to generate PDF.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDownloadPDF = () => {
//     if (pdfUrl) {
//       const link = document.createElement("a");
//       link.href = pdfUrl;
//       link.download = `${companyName || "resume"}.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   const handlePrintPDF = () => {
//     if (pdfUrl) {
//       const printWindow = window.open(pdfUrl);
//       printWindow.onload = () => printWindow.print();
//     }
//   };

//   return (
//     <div>
//       <header className="rheader">
//         <h1>ResuMe</h1>
//         <p>
//           <strong>Resume Update | Cover Letter | Cold Mail</strong>
//         </p>
//         <button
//           onClick={() => {
//             localStorage.removeItem("loggedIn");
//             navigate("/login");
//           }}
//         >
//           🚪 Logout
//         </button>
//       </header>

//       <div className="resume-generation-container">
//         <div className="rleft-panel">
//           <h2>Resume Fields</h2>
//           <ul className="field-list">
//             {Object.keys(fieldLabels).map((field) => (
//               <li
//                 key={field}
//                 className={selectedField === field ? "active" : ""}
//                 onClick={() => setSelectedField(field)}
//               >
//                 {fieldLabels[field]}
//               </li>
//             ))}
//             <button
//               className="generate-btn"
//               onClick={handleGeneratePDF}
//               disabled={isLoading}
//             >
//               {isLoading ? "⏳ Generating..." : " MAKE"}
//             </button>
//             <button
//               className="generate-btn"
//               onClick={() => navigate("/jdinput")}
//             >
//               HOME
//             </button>
//           </ul>
//         </div>

//         <div className="rmiddle-panel">
//           <h2>{fieldLabels[selectedField]}</h2>
//           <textarea
//             value={editableData[selectedField] || ""}
//             onChange={(e) => handleFieldChange(selectedField, e.target.value)}
//             rows={20}
//             placeholder="Edit the LaTeX content here..."
//           />
//           {/* <div className="editor-actions">
//           <button onClick={handleGeneratePDF}>🎯 Regenerate PDF</button>
//           <button onClick={handleDownloadPDF} disabled={!pdfUrl}>
//             💾 Download
//           </button>
//           <button onClick={handlePrintPDF} disabled={!pdfUrl}>
//             🖨️ Print
//           </button>
//         </div> */}
//           {message && (
//             <div
//               className={`status ${
//                 message.includes("✅") ? "success" : "error"
//               }`}
//             >
//               {message}
//             </div>
//           )}
//         </div>

//         <div className="rright-panel">
//           <h2>Resume Preview</h2>
//           {pdfUrl ? (
//             <iframe
//               src={pdfUrl}
//               title="Resume PDF"
//               frameBorder="0"
//               width="100%"
//               height="100%"
//             />
//           ) : (
//             <p className="no-preview">No resume generated yet</p>
//           )}
//         </div>

//         {isLoading && (
//           <div className="loading-overlay">
//             <div className="loading-spinner" />
//             <p>Generating your resume PDF...</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ResumeGeneration;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/ResumeGeneration.css";

function ResumeGeneration() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resumeData, companyName } = location.state || {};

  const [selectedField, setSelectedField] = useState("PROFESSIONAL_SUMMARY");

  // 🆕 Add COMPANY_NAME into editable fields
  const [editableData, setEditableData] = useState({
    ...resumeData,
    COMPANY_NAME: companyName || "", // make editable
  });

  const [pdfUrl, setPdfUrl] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fieldLabels = {
    COMPANY_NAME: "Company Name", // 🆕 New field
    PROFESSIONAL_SUMMARY: "Professional Summary",
    TECHNICAL_SKILLS: "Technical Skills",
    METLIFE_BULLET_POINTS: "MetLife Experience",
    ADONS_BULLET_POINTS: "Adons Experience",
  };

  const handleFieldChange = (field, value) => {
    setEditableData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGeneratePDF = async () => {
    try {
      setIsLoading(true);
      setMessage("⏳ Generating PDF...");

      const response = await axios.post(
        "http://localhost:8080/api/resume/generate",
        editableData,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setMessage("✅ PDF generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      setMessage("❌ Failed to generate PDF.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;

      const name = editableData.COMPANY_NAME || "resume";
      link.download = `Resume${name}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrintPDF = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl);
      printWindow.onload = () => printWindow.print();
    }
  };

  return (
    <div>
      <header className="rheader">
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

      <div className="resume-generation-container">
        {/* Left */}
        <div className="rleft-panel">
          <h2>Resume Fields</h2>
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
              {isLoading ? "⏳ Generating..." : " MAKE"}
            </button>
            <button
              className="generate-btn"
              onClick={() => navigate("/jdinput")}
            >
              HOME
            </button>
          </ul>
        </div>

        {/* Middle */}
        <div className="rmiddle-panel">
          <h2>{fieldLabels[selectedField]}</h2>
          <textarea
            value={editableData[selectedField] || ""}
            onChange={(e) => handleFieldChange(selectedField, e.target.value)}
            rows={20}
            placeholder="Edit the LaTeX content here..."
          />
          {message && (
            <div
              className={`status ${
                message.includes("✅") ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="rright-panel">
          <div className="resume-preview-header">
            <h2>Resume Preview</h2>
            {pdfUrl && (
              <button onClick={handleDownloadPDF} className="action-btn">
                💾 Download
              </button>
            )}
          </div>

          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              title="Resume PDF"
              frameBorder="0"
              width="100%"
              height="100%"
            />
          ) : (
            <p className="no-preview">No resume generated yet</p>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
          <p>Generating your resume PDF...</p>
        </div>
      )}
    </div>
  );
}

export default ResumeGeneration;
