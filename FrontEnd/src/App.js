import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  // State to store form data
  const [formData, setFormData] = useState({
    PROFESSIONAL_SUMMARY: "",
    TECHNICAL_SKILLS: "",
    METLIFE_BULLET_POINTS: "",
    ADONS_BULLET_POINTS: "",
  });

  // Cover letter form data
  const [coverLetterData, setCoverLetterData] = useState({
    COVER_LETTER_DATE: "",
    COMPANY_NAME: "",
    COMPANY_ADDRESS: "",
    SALUTATION: "",
    CONTENT: "",
  });

  // State for loading, messages, and PDF
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [activeSection, setActiveSection] = useState("summary");
  const [currentMode, setCurrentMode] = useState("resume"); // 'resume' or 'coverLetter'

  // Handle input changes for resume
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle input changes for cover letter
  const handleCoverLetterChange = (e) => {
    const { name, value } = e.target;
    setCoverLetterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Generate resume
  const handleGenerateAndPreview = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      console.log("🚀 Generating PDF with user data:", formData);

      const response = await axios.post(
        "http://localhost:8080/api/resume/generate",
        formData,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      setPdfBlob(blob);
      setPdfUrl(url);
      setShowPDFViewer(true);

      setMessage("✅ PDF generated successfully! Review and print if needed.");
    } catch (error) {
      console.error("❌ Error generating PDF:", error);
      setMessage("❌ Error generating PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate cover letter
  const handleGenerateCoverLetter = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      console.log(
        "🚀 Generating cover letter with user data:",
        coverLetterData
      );

      const response = await axios.post(
        "http://localhost:8080/api/resume/generate-cover-letter",
        coverLetterData,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      setPdfBlob(blob);
      setPdfUrl(url);
      setShowPDFViewer(true);

      setMessage(
        "✅ Cover letter generated successfully! Review and print if needed."
      );
    } catch (error) {
      console.error("❌ Error generating cover letter:", error);
      setMessage("❌ Error generating cover letter. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Download PDF
  const handleDownloadPDF = () => {
    if (pdfBlob) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download =
        currentMode === "resume" ? "resume.pdf" : "cover-letter.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setMessage(
        `📄 ${
          currentMode === "resume" ? "Resume" : "Cover letter"
        } downloaded successfully!`
      );
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

  // Close PDF viewer
  const handleClosePDFViewer = () => {
    setShowPDFViewer(false);
    if (pdfUrl) {
      window.URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
      setPdfBlob(null);
    }
  };

  // Test with sample data (updated to handle both modes)
  const handleTestGeneration = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const endpoint =
        currentMode === "resume"
          ? "http://localhost:8080/api/resume/test"
          : "http://localhost:8080/api/resume/test-cover-letter-simple";

      const response = await axios.get(endpoint, { responseType: "blob" });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      setPdfBlob(blob);
      setPdfUrl(url);
      setShowPDFViewer(true);

      setMessage(
        `✅ Test ${
          currentMode === "resume" ? "resume" : "cover letter"
        } generated successfully!`
      );
    } catch (error) {
      console.error(`❌ Error generating test ${currentMode}:`, error);
      setMessage(`❌ Error generating test ${currentMode}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Load sample data
  const handleLoadSampleData = () => {
    if (currentMode === "resume") {
      setFormData({
        PROFESSIONAL_SUMMARY: `    \\item Software Engineer with \\textbf{4+} years of full-stack development experience across Banking, HealthCare, and eCommerce sectors, combining hands-on expertise in React frontend development with research contributions in data structures \\& algorithms, payment systems, chatbot technologies, and machine design optimization.
    \\item Excellent at coding and programming enhancements and changes for portions and subsystems of systems software, including operating systems and internet-related tools.
    \\item Proven ability to execute test plans, identify, log, and debug assigned issues, ensuring high-quality software solutions and system stability across multiple platforms.
    \\item Collaborative team player with strong analytical and problem-solving skills, dedicated to developing cost-effective and reliable solutions in both internal and outsourced environments.`,

        TECHNICAL_SKILLS: `Languages & Core Java, Python, C, C++ \\\\
Methodologies \\& OS & SDLC, Agile, Waterfall, Linux, Windows, MacOS \\\\
Frameworks \\& IDEs & SpringBoot, Microservices, Hibernate, JPA, React.JS, Node.JS \\\\
Web Technologies & HTML, CSS, JavaScript, TypeScript, Next.js, Bootstrap \\\\
Cloud/Application Servers & AWS (VPC, EC2, S3, ELB), Azure, Tomcat, Docker \\\\
Version Control \\& Tools & Git, GitHub, Maven, Gradle, Jira, Jenkins, CI/CD \\\\
Databases \\& J2EE & MySQL, PostgreSQL, MongoDB, Oracle DB (exposure), Servlets, JSP`,

        METLIFE_BULLET_POINTS: `    \\item Implemented Agile methodologies, enhancing team productivity by \\textbf{15\\%} and accelerating project delivery by \\textbf{20\\%}.
    \\item Engineered applications using Core Java, Spring Boot, and Microservices, improving scalability by \\textbf{30\\%} and reducing downtime by \\textbf{20\\%}.
    \\item Debugged and resolved critical issues in production code, improving system stability by \\textbf{25\\%} using established testing protocols.
    \\item Developed responsive front-end interfaces using React.js, Angular, HTML, and CSS, achieving \\textbf{98\\%} cross-browser compatibility and enhanced user experience.
    \\item Deployed applications on AWS infrastructure, optimizing resource utilization, reducing infrastructure costs by \\textbf{20\\%}.`,

        ADONS_BULLET_POINTS: `    \\item Designed responsive UIs using HTML, CSS, Bootstrap, and JavaScript, enhancing user experience and increasing traffic by \\textbf{20\\%}.
    \\item Optimized high-performance backend systems using Core Java, Servlets, JSP, and JDBC, improving processing speed by \\textbf{45\\%}.
    \\item Led waterfall project workflows, achieving \\textbf{100\\%} on-time delivery and maintaining clear phase-gate reviews, ensuring project success.
    \\item Conducted thorough testing and debugging of software modules, identifying and resolving critical issues to ensure high-quality deliverables.
    \\item Maintained comprehensive documentation of software design and development processes, facilitating knowledge sharing and collaboration within the team.`,
      });
    } else {
      setCoverLetterData({
        COVER_LETTER_DATE: "January 18, 2025",
        COMPANY_NAME: "Google Inc.",
        COMPANY_ADDRESS: "1600 Amphitheatre Parkway\\\\Mountain View, CA 94043",
        SALUTATION: "Hiring Manager",
        CONTENT: `I am writing to express my enthusiasm for the Software Engineer position at Google Inc. With over four years of hands-on experience in full-stack software development and a Master's degree in Software Engineering from Saint Louis University, I am eager to contribute to your team and bring innovative solutions that enhance system performance and user satisfaction.\\n\\nIn my previous role at MetLife, I have led multiple Agile teams to develop high-availability backend systems using Core Java, Spring Boot, and Microservices, achieving a 30% improvement in scalability. My front-end development skills in React.js and Angular, coupled with efficient AWS deployments, resulted in a 20% reduction in operational costs.\\n\\nI am particularly drawn to Google's values around innovation and collaboration, and I am confident that my background and skills will allow me to meaningfully contribute to your projects from day one.\\n\\nThank you for considering my application. I would welcome the opportunity to further discuss how I can support your team.`,
      });
    }
    setMessage("📝 Sample data loaded! You can now generate PDF.");
  };

  const resumeSections = [
    { id: "summary", name: "Professional Summary", icon: "📝" },
    { id: "skills", name: "Technical Skills", icon: "🛠️" },
    { id: "metlife", name: "MetLife Experience", icon: "🏢" },
    { id: "adons", name: "Adons Experience", icon: "🏭" },
  ];

  const coverLetterSections = [
    { id: "date", name: "Date & Company Info", icon: "📅" },
    { id: "content", name: "Letter Content", icon: "✍️" },
  ];

  const sections =
    currentMode === "resume" ? resumeSections : coverLetterSections;

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Resume Generator</h1>
          <p className="app-subtitle">
            Create your professional resume and cover letters with LaTeX
            precision
          </p>

          {/* Mode Toggle */}
          <div className="mode-toggle">
            <button
              className={`mode-btn ${currentMode === "resume" ? "active" : ""}`}
              onClick={() => {
                setCurrentMode("resume");
                setActiveSection("summary");
                setShowPDFViewer(false);
              }}
            >
              📄 Resume
            </button>
            <button
              className={`mode-btn ${
                currentMode === "coverLetter" ? "active" : ""
              }`}
              onClick={() => {
                setCurrentMode("coverLetter");
                setActiveSection("date");
                setShowPDFViewer(false);
              }}
            >
              📝 Cover Letter
            </button>
          </div>
        </div>
      </header>

      <div className="main-container">
        {/* Sidebar Navigation */}
        <aside className="sidebar">
          <div className="sidebar-content">
            <h3>Sections</h3>
            <nav className="section-nav">
              {sections.map((section) => (
                <button
                  key={section.id}
                  className={`nav-item ${
                    activeSection === section.id ? "active" : ""
                  }`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <span className="nav-icon">{section.icon}</span>
                  {section.name}
                </button>
              ))}
            </nav>

            <div className="action-buttons">
              <button
                onClick={handleLoadSampleData}
                className="btn btn-secondary"
              >
                📋 Load Sample Data
              </button>
              <button
                onClick={handleTestGeneration}
                disabled={isLoading}
                className="btn btn-info"
              >
                🧪{" "}
                {isLoading
                  ? "Generating..."
                  : `Generate Test ${
                      currentMode === "resume" ? "Resume" : "Cover Letter"
                    }`}
              </button>
              <button
                onClick={
                  currentMode === "resume"
                    ? handleGenerateAndPreview
                    : handleGenerateCoverLetter
                }
                disabled={isLoading}
                className="btn btn-success"
              >
                {isLoading
                  ? "⏳ Generating..."
                  : `📄 Generate & Preview ${
                      currentMode === "resume" ? "Resume" : "Cover Letter"
                    }`}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="content-area">
          <div className={`content-grid ${showPDFViewer ? "with-viewer" : ""}`}>
            {/* Form Section */}
            <div className="form-panel">
              <div className="panel-header">
                <h2>
                  {sections.find((s) => s.id === activeSection)?.icon}{" "}
                  {sections.find((s) => s.id === activeSection)?.name}
                </h2>
              </div>

              <div className="form-content">
                {currentMode === "resume" ? (
                  // Resume form sections
                  <>
                    {activeSection === "summary" && (
                      <FormSection
                        title="Professional Summary"
                        name="PROFESSIONAL_SUMMARY"
                        value={formData.PROFESSIONAL_SUMMARY}
                        onChange={handleInputChange}
                        placeholder="    \\item Software Engineer with 4+ years of experience...&#10;    \\item Expert in Java, Spring Boot, and React...&#10;    \\item Proven track record of delivering solutions..."
                        helpText="Enter your professional summary as LaTeX items. Each line should start with \\item"
                        rows={8}
                      />
                    )}

                    {activeSection === "skills" && (
                      <FormSection
                        title="Technical Skills"
                        name="TECHNICAL_SKILLS"
                        value={formData.TECHNICAL_SKILLS}
                        onChange={handleInputChange}
                        placeholder="Languages & Java, Python, JavaScript, TypeScript \\\\&#10;Frameworks & Spring Boot, React.js, Node.js \\\\&#10;Databases & MySQL, PostgreSQL, MongoDB \\\\"
                        helpText="Enter skills as LaTeX table rows. Each line should end with \\\\"
                        rows={8}
                      />
                    )}

                    {activeSection === "metlife" && (
                      <FormSection
                        title="MetLife Experience"
                        name="METLIFE_BULLET_POINTS"
                        value={formData.METLIFE_BULLET_POINTS}
                        onChange={handleInputChange}
                        placeholder="    \\item Implemented Agile methodologies, enhancing team productivity...&#10;    \\item Engineered applications using Core Java, Spring Boot...&#10;    \\item Debugged and resolved critical issues..."
                        helpText="Enter your MetLife achievements as LaTeX items. Each line should start with \\item"
                        rows={8}
                      />
                    )}

                    {activeSection === "adons" && (
                      <FormSection
                        title="Adons Soft Tech Experience"
                        name="ADONS_BULLET_POINTS"
                        value={formData.ADONS_BULLET_POINTS}
                        onChange={handleInputChange}
                        placeholder="    \\item Designed responsive UIs using HTML, CSS, Bootstrap...&#10;    \\item Optimized high-performance backend systems...&#10;    \\item Led waterfall project workflows..."
                        helpText="Enter your Adons achievements as LaTeX items. Each line should start with \\item"
                        rows={8}
                      />
                    )}
                  </>
                ) : (
                  // Cover letter form sections
                  <>
                    {activeSection === "date" && (
                      <CoverLetterDateSection
                        coverLetterData={coverLetterData}
                        onChange={handleCoverLetterChange}
                      />
                    )}

                    {activeSection === "content" && (
                      <CoverLetterContentSection
                        coverLetterData={coverLetterData}
                        onChange={handleCoverLetterChange}
                      />
                    )}
                  </>
                )}
              </div>
            </div>

            {/* PDF Viewer Section */}
            {showPDFViewer && pdfUrl && (
              <div className="pdf-viewer-panel">
                <div className="panel-header">
                  <h2>
                    📄 Generated{" "}
                    {currentMode === "resume" ? "Resume" : "Cover Letter"}
                  </h2>
                  <div className="pdf-actions">
                    <button
                      onClick={handleDownloadPDF}
                      className="btn btn-primary btn-sm"
                    >
                      💾 Download
                    </button>
                    <button
                      onClick={handlePrintPDF}
                      className="btn btn-secondary btn-sm"
                    >
                      🖨️ Print
                    </button>
                    <button
                      onClick={handleClosePDFViewer}
                      className="close-viewer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="pdf-content">
                  <iframe
                    src={pdfUrl}
                    width="100%"
                    height="100%"
                    title={`Generated ${
                      currentMode === "resume" ? "Resume" : "Cover Letter"
                    }`}
                    frameBorder="0"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Status Messages */}
          {message && (
            <div
              className={`status-message ${
                message.includes("✅") ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}

          {/* Loading Overlay */}
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-content">
                <div className="spinner"></div>
                <p>
                  Generating your{" "}
                  {currentMode === "resume" ? "resume" : "cover letter"}...
                  Please wait
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Form Section Component
function FormSection({
  title,
  name,
  value,
  onChange,
  placeholder,
  helpText,
  rows = 6,
}) {
  return (
    <div className="form-section">
      <label className="form-label">{title}</label>
      <p className="help-text">{helpText}</p>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="form-textarea"
      />
    </div>
  );
}

// Cover Letter Date Section Component
function CoverLetterDateSection({ coverLetterData, onChange }) {
  return (
    <div className="cover-letter-section">
      <div className="form-section">
        <label className="form-label">Date</label>
        <p className="help-text">Enter the date for your cover letter</p>
        <input
          type="text"
          name="COVER_LETTER_DATE"
          value={coverLetterData.COVER_LETTER_DATE}
          onChange={onChange}
          placeholder="January 18, 2025"
          className="form-input"
        />
      </div>

      <div className="form-section">
        <label className="form-label">Company Name</label>
        <p className="help-text">Enter the company name</p>
        <input
          type="text"
          name="COMPANY_NAME"
          value={coverLetterData.COMPANY_NAME}
          onChange={onChange}
          placeholder="Google Inc."
          className="form-input"
        />
      </div>

      <div className="form-section">
        <label className="form-label">Company Address</label>
        <p className="help-text">
          Enter the company address (use \\\\ for line breaks)
        </p>
        <textarea
          name="COMPANY_ADDRESS"
          value={coverLetterData.COMPANY_ADDRESS}
          onChange={onChange}
          placeholder="1600 Amphitheatre Parkway\\Mountain View, CA 94043"
          rows={3}
          className="form-textarea"
        />
      </div>

      <div className="form-section">
        <label className="form-label">Salutation</label>
        <p className="help-text">How you want to address the recipient</p>
        <input
          type="text"
          name="SALUTATION"
          value={coverLetterData.SALUTATION}
          onChange={onChange}
          placeholder="Hiring Manager"
          className="form-input"
        />
      </div>
    </div>
  );
}

// Cover Letter Content Section Component
function CoverLetterContentSection({ coverLetterData, onChange }) {
  return (
    <div className="cover-letter-section">
      <div className="form-section">
        <label className="form-label">Cover Letter Content</label>
        <p className="help-text">
          Write your cover letter content. Use \\n for paragraph breaks.
        </p>
        <textarea
          name="CONTENT"
          value={coverLetterData.CONTENT}
          onChange={onChange}
          placeholder="I am writing to express my enthusiasm for the [Position] opportunity at [Company Name]...&#10;&#10;[Add your experience and qualifications here]...&#10;&#10;Thank you for considering my application."
          rows={15}
          className="form-textarea"
        />
      </div>
    </div>
  );
}

export default App;
