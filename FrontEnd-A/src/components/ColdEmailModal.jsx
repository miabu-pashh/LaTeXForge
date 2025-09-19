// import React, { useState, useEffect } from "react";
// import { sendCustomEmails } from "../services/coldEmailService";

// const ColdEmailModal = ({ isOpen, onClose, coldEmail, companyName }) => {
//   const [contacts, setContacts] = useState([]);
//   const [newContact, setNewContact] = useState({
//     name: "",
//     email: "",
//     title: "",
//   });
//   const [candidateInfo, setCandidateInfo] = useState({
//     candidateName: "Mahaboob Pasha Mohammad",
//     candidateEmail: "mahaboobpashamohammad8@gmail.com",
//     candidatePhone: "3143056056",
//   });
//   const [emailData, setEmailData] = useState({
//     subject: "",
//     body: "",
//     companyName: companyName || "",
//     hiringManagerName: "Hiring Manager",
//   });
//   const [attachments, setAttachments] = useState([]);
//   const [sending, setSending] = useState(false);

//   // Initialize email data when modal opens
//   useEffect(() => {
//     if (isOpen && coldEmail) {
//       const emailSubject =
//         coldEmail.match(/Subject:\s*(.*)/i)?.[1]?.trim() || "Job Application";
//       const emailBody = coldEmail.replace(/Subject:.*\n?/i, "").trim();

//       setEmailData({
//         subject: emailSubject,
//         body: emailBody,
//         companyName: companyName || "",
//         hiringManagerName: "Hiring Manager",
//       });
//     }
//   }, [isOpen, coldEmail, companyName]);

//   const addContact = () => {
//     if (newContact.name && newContact.email) {
//       const contact = {
//         name: newContact.title
//           ? `${newContact.name} (${newContact.title})`
//           : newContact.name,
//         email: newContact.email,
//         company: emailData.companyName,
//       };

//       setContacts([...contacts, contact]);
//       setNewContact({ name: "", email: "", title: "" });
//     }
//   };

//   const removeContact = (index) => {
//     setContacts(contacts.filter((_, i) => i !== index));
//   };

//   const handleFileAttachment = (event) => {
//     const files = Array.from(event.target.files);
//     const maxSize = 25 * 1024 * 1024; // 25MB limit
//     const allowedTypes = [
//       "application/pdf",
//       "application/msword",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       "text/plain",
//     ];

//     const validFiles = files.filter((file) => {
//       if (file.size > maxSize) {
//         alert(`File "${file.name}" is too large. Maximum size is 25MB.`);
//         return false;
//       }
//       if (!allowedTypes.includes(file.type)) {
//         alert(
//           `File "${file.name}" type not supported. Please use PDF, DOC, DOCX, or TXT files.`
//         );
//         return false;
//       }
//       return true;
//     });

//     validFiles.forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = () => {
//         const base64 = reader.result.split(",")[1];
//         setAttachments((prev) => [
//           ...prev,
//           {
//             name: file.name,
//             type: file.type,
//             size: file.size,
//             base64: base64,
//           },
//         ]);
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const removeAttachment = (index) => {
//     setAttachments(attachments.filter((_, i) => i !== index));
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//   };

//   const personalizeContentForPreview = (content) => {
//     const firstContactName =
//       contacts.length > 0
//         ? contacts[0].name.replace(/\s*\([^)]*\)/g, "").trim()
//         : emailData.hiringManagerName;

//     return content
//       .replace(/\[CANDIDATE_NAME\]/g, candidateInfo.candidateName)
//       .replace(/\{CANDIDATE_NAME\}/g, candidateInfo.candidateName)
//       .replace(/\[RECIPIENT_NAME\]/g, firstContactName)
//       .replace(/\{RECIPIENT_NAME\}/g, firstContactName)
//       .replace(/\[HIRING_MANAGER\]/g, firstContactName)
//       .replace(/\{HIRING_MANAGER\}/g, firstContactName)
//       .replace(/\[Hiring Manager's Name\]/g, firstContactName)
//       .replace(/Hiring Manager's Name/g, firstContactName)
//       .replace(/\[COMPANY_NAME\]/g, emailData.companyName)
//       .replace(/\{COMPANY_NAME\}/g, emailData.companyName)
//       .replace(/\[Company Name\]/g, emailData.companyName)
//       .replace(/Company Name/g, emailData.companyName)
//       .replace(/\[company\s*name\]/gi, emailData.companyName)
//       .replace(/\[hiring\s*manager\]/gi, firstContactName)
//       .replace(/\[recipient\s*name\]/gi, firstContactName);
//   };

//   const handleSendEmails = async () => {
//     if (contacts.length === 0) {
//       alert("Please add at least one HR contact.");
//       return;
//     }

//     if (!emailData.companyName.trim()) {
//       alert("Please enter the company name.");
//       return;
//     }

//     setSending(true);
//     try {
//       // Send the original template content, let backend handle personalization
//       const response = await sendCustomEmails({
//         candidateName: candidateInfo.candidateName,
//         candidateEmail: candidateInfo.candidateEmail,
//         candidatePhone: candidateInfo.candidatePhone,
//         companyName: emailData.companyName,
//         customSubject: emailData.subject, // Send original template
//         customBody: emailData.body, // Send original template
//         selectedContacts: contacts,
//         attachments: attachments,
//       });

//       if (response.data.status === "success") {
//         alert(
//           `✅ Success! ${response.data.successCount} emails sent successfully out of ${response.data.totalEmails} total emails!`
//         );
//         onClose();
//         setContacts([]);
//         setAttachments([]);
//       } else {
//         alert(
//           `❌ ${
//             response.data.message ||
//             "Some emails failed to send. Check console for details."
//           }`
//         );
//       }
//     } catch (error) {
//       console.error("Send error:", error);

//       if (error.response) {
//         alert(
//           `❌ Backend error: ${error.response.data.message || "Unknown error"}`
//         );
//       } else if (error.request) {
//         alert(
//           "❌ Cannot connect to backend. Make sure Spring Boot is running on port 8080."
//         );
//       } else {
//         alert(`❌ Error: ${error.message}`);
//       }
//     } finally {
//       setSending(false);
//     }
//   };

//   if (!isOpen) return null;

//   // Gmail-style CSS
//   const styles = {
//     overlay: {
//       position: "fixed",
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: "rgba(0, 0, 0, 0.4)",
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       zIndex: 1000,
//     },
//     modal: {
//       backgroundColor: "white",
//       width: "90%",
//       maxWidth: "900px",
//       maxHeight: "95vh",
//       borderRadius: "8px",
//       boxShadow:
//         "0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2)",
//       overflow: "hidden",
//       fontFamily:
//         "Google Sans, Roboto, RobotoDraft, Helvetica, Arial, sans-serif",
//     },
//     header: {
//       padding: "16px 24px",
//       borderBottom: "1px solid #dadce0",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       backgroundColor: "#f8f9fa",
//     },
//     title: {
//       fontSize: "16px",
//       fontWeight: "500",
//       color: "#3c4043",
//       margin: 0,
//     },
//     closeButton: {
//       background: "none",
//       border: "none",
//       fontSize: "20px",
//       cursor: "pointer",
//       color: "#5f6368",
//       padding: "8px",
//       borderRadius: "4px",
//     },
//     content: {
//       padding: "24px",
//       overflowY: "auto",
//       maxHeight: "calc(95vh - 140px)",
//     },
//     grid: {
//       display: "grid",
//       gridTemplateColumns: "1fr 1fr",
//       gap: "24px",
//     },
//     section: {
//       marginBottom: "24px",
//     },
//     sectionTitle: {
//       fontSize: "14px",
//       fontWeight: "500",
//       color: "#3c4043",
//       marginBottom: "12px",
//       margin: "0 0 12px 0",
//     },
//     input: {
//       width: "100%",
//       padding: "12px 16px",
//       border: "1px solid #dadce0",
//       borderRadius: "4px",
//       fontSize: "14px",
//       fontFamily: "inherit",
//       outline: "none",
//       transition: "border-color 0.2s",
//     },
//     textarea: {
//       width: "100%",
//       padding: "12px 16px",
//       border: "1px solid #dadce0",
//       borderRadius: "4px",
//       fontSize: "14px",
//       fontFamily: "Roboto Mono, monospace",
//       outline: "none",
//       resize: "vertical",
//       lineHeight: "1.4",
//     },
//     button: {
//       padding: "8px 16px",
//       border: "none",
//       borderRadius: "4px",
//       fontSize: "14px",
//       fontWeight: "500",
//       cursor: "pointer",
//       transition: "all 0.2s",
//     },
//     primaryButton: {
//       backgroundColor: "#1a73e8",
//       color: "white",
//     },
//     secondaryButton: {
//       backgroundColor: "#f8f9fa",
//       color: "#3c4043",
//       border: "1px solid #dadce0",
//     },
//     successButton: {
//       backgroundColor: "#137333",
//       color: "white",
//     },
//     contactItem: {
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       padding: "12px",
//       backgroundColor: "#f8f9fa",
//       marginBottom: "8px",
//       borderRadius: "4px",
//       border: "1px solid #e8eaed",
//     },
//     attachmentItem: {
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       padding: "8px 12px",
//       backgroundColor: "#f8f9fa",
//       marginBottom: "4px",
//       borderRadius: "4px",
//       border: "1px solid #e8eaed",
//     },
//     preview: {
//       border: "1px solid #dadce0",
//       borderRadius: "4px",
//       padding: "16px",
//       backgroundColor: "#f8f9fa",
//       fontSize: "13px",
//     },
//     footer: {
//       padding: "16px 24px",
//       borderTop: "1px solid #dadce0",
//       display: "flex",
//       justifyContent: "flex-end",
//       gap: "12px",
//       backgroundColor: "#f8f9fa",
//     },
//     tip: {
//       fontSize: "12px",
//       color: "#5f6368",
//       marginTop: "8px",
//       padding: "12px",
//       backgroundColor: "#e8f0fe",
//       borderRadius: "4px",
//       border: "1px solid #d2e3fc",
//     },
//   };

//   return (
//     <div style={styles.overlay}>
//       <div style={styles.modal}>
//         {/* Header */}
//         <div style={styles.header}>
//           <h2 style={styles.title}>New Message</h2>
//           <button
//             onClick={onClose}
//             style={styles.closeButton}
//             onMouseEnter={(e) => (e.target.style.backgroundColor = "#f1f3f4")}
//             onMouseLeave={(e) =>
//               (e.target.style.backgroundColor = "transparent")
//             }
//           >
//             ×
//           </button>
//         </div>

//         {/* Content */}
//         <div style={styles.content}>
//           <div style={styles.grid}>
//             {/* Left Column */}
//             <div>
//               {/* Candidate Info */}
//               <div style={styles.section}>
//                 <h3 style={styles.sectionTitle}>Your Information</h3>
//                 <div style={{ display: "grid", gap: "12px" }}>
//                   <input
//                     type="text"
//                     placeholder="Your Name"
//                     value={candidateInfo.candidateName}
//                     onChange={(e) =>
//                       setCandidateInfo({
//                         ...candidateInfo,
//                         candidateName: e.target.value,
//                       })
//                     }
//                     style={styles.input}
//                   />
//                   <input
//                     type="email"
//                     placeholder="Your Email"
//                     value={candidateInfo.candidateEmail}
//                     onChange={(e) =>
//                       setCandidateInfo({
//                         ...candidateInfo,
//                         candidateEmail: e.target.value,
//                       })
//                     }
//                     style={styles.input}
//                   />
//                   <input
//                     type="tel"
//                     placeholder="Your Phone"
//                     value={candidateInfo.candidatePhone}
//                     onChange={(e) =>
//                       setCandidateInfo({
//                         ...candidateInfo,
//                         candidatePhone: e.target.value,
//                       })
//                     }
//                     style={styles.input}
//                   />
//                 </div>
//               </div>

//               {/* Company Info */}
//               <div style={styles.section}>
//                 <h3 style={styles.sectionTitle}>Company Information</h3>
//                 <div style={{ display: "grid", gap: "12px" }}>
//                   <input
//                     type="text"
//                     placeholder="Company Name"
//                     value={emailData.companyName}
//                     onChange={(e) =>
//                       setEmailData({
//                         ...emailData,
//                         companyName: e.target.value,
//                       })
//                     }
//                     style={styles.input}
//                   />
//                 </div>
//               </div>

//               {/* Add HR Contacts */}
//               <div style={styles.section}>
//                 <h3 style={styles.sectionTitle}>Add HR Contacts</h3>
//                 <div
//                   style={{ display: "grid", gap: "12px", marginBottom: "16px" }}
//                 >
//                   <input
//                     type="text"
//                     placeholder="HR Name"
//                     value={newContact.name}
//                     onChange={(e) =>
//                       setNewContact({ ...newContact, name: e.target.value })
//                     }
//                     style={styles.input}
//                   />
//                   <input
//                     type="email"
//                     placeholder="HR Email"
//                     value={newContact.email}
//                     onChange={(e) =>
//                       setNewContact({ ...newContact, email: e.target.value })
//                     }
//                     style={styles.input}
//                   />
//                   <input
//                     type="text"
//                     placeholder="Job Title (optional)"
//                     value={newContact.title}
//                     onChange={(e) =>
//                       setNewContact({ ...newContact, title: e.target.value })
//                     }
//                     style={styles.input}
//                   />
//                 </div>
//                 <button
//                   onClick={addContact}
//                   disabled={!newContact.name || !newContact.email}
//                   style={{
//                     ...styles.button,
//                     ...styles.successButton,
//                     opacity: !newContact.name || !newContact.email ? 0.5 : 1,
//                   }}
//                 >
//                   Add Contact
//                 </button>
//               </div>

//               {/* Contact List */}
//               {contacts.length > 0 && (
//                 <div style={styles.section}>
//                   <h3 style={styles.sectionTitle}>
//                     HR Contacts ({contacts.length})
//                   </h3>
//                   <div style={{ maxHeight: "200px", overflowY: "auto" }}>
//                     {contacts.map((contact, index) => (
//                       <div key={index} style={styles.contactItem}>
//                         <div>
//                           <div style={{ fontWeight: "500", fontSize: "14px" }}>
//                             {contact.name}
//                           </div>
//                           <div style={{ fontSize: "12px", color: "#5f6368" }}>
//                             {contact.email}
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => removeContact(index)}
//                           style={{
//                             ...styles.button,
//                             backgroundColor: "transparent",
//                             color: "#d93025",
//                             padding: "4px 8px",
//                           }}
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Right Column */}
//             <div>
//               {/* Email Editor */}
//               <div style={styles.section}>
//                 <h3 style={styles.sectionTitle}>Email Content</h3>
//                 <div style={{ marginBottom: "16px" }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: "8px",
//                       fontSize: "14px",
//                       fontWeight: "500",
//                     }}
//                   >
//                     Subject:
//                   </label>
//                   <input
//                     type="text"
//                     value={emailData.subject}
//                     onChange={(e) =>
//                       setEmailData({ ...emailData, subject: e.target.value })
//                     }
//                     style={styles.input}
//                   />
//                 </div>
//                 <div style={{ marginBottom: "16px" }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: "8px",
//                       fontSize: "14px",
//                       fontWeight: "500",
//                     }}
//                   >
//                     Body:
//                   </label>
//                   <textarea
//                     value={emailData.body}
//                     onChange={(e) =>
//                       setEmailData({ ...emailData, body: e.target.value })
//                     }
//                     rows="10"
//                     style={styles.textarea}
//                   />
//                 </div>
//                 <div style={styles.tip}>
//                   💡 Use placeholders: [CANDIDATE_NAME], [RECIPIENT_NAME],
//                   [COMPANY_NAME], [HIRING_MANAGER]
//                 </div>
//               </div>

//               {/* File Attachments */}
//               <div style={styles.section}>
//                 <h3 style={styles.sectionTitle}>Attachments</h3>
//                 <input
//                   type="file"
//                   multiple
//                   accept=".pdf,.doc,.docx,.txt"
//                   onChange={handleFileAttachment}
//                   style={{ marginBottom: "12px" }}
//                 />
//                 <div
//                   style={{
//                     fontSize: "12px",
//                     color: "#5f6368",
//                     marginBottom: "16px",
//                   }}
//                 >
//                   Supported: PDF, DOC, DOCX, TXT (Max 25MB each)
//                 </div>

//                 {attachments.length > 0 && (
//                   <div>
//                     <h4 style={{ ...styles.sectionTitle, fontSize: "13px" }}>
//                       Attached Files ({attachments.length})
//                     </h4>
//                     {attachments.map((file, index) => (
//                       <div key={index} style={styles.attachmentItem}>
//                         <div>
//                           <div style={{ fontWeight: "500", fontSize: "13px" }}>
//                             {file.name}
//                           </div>
//                           <div style={{ fontSize: "11px", color: "#5f6368" }}>
//                             {formatFileSize(file.size)}
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => removeAttachment(index)}
//                           style={{
//                             ...styles.button,
//                             backgroundColor: "transparent",
//                             color: "#d93025",
//                             padding: "4px 8px",
//                           }}
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Preview */}
//               <div style={styles.section}>
//                 <h3 style={styles.sectionTitle}>Preview (Sample)</h3>
//                 <div style={styles.preview}>
//                   <div style={{ marginBottom: "12px" }}>
//                     <strong>To:</strong>{" "}
//                     {contacts.length > 0 ? contacts[0].email : "HR Email"}
//                   </div>
//                   <div style={{ marginBottom: "12px" }}>
//                     <strong>Subject:</strong>{" "}
//                     {personalizeContentForPreview(emailData.subject)}
//                   </div>
//                   <div
//                     style={{
//                       whiteSpace: "pre-line",
//                       maxHeight: "120px",
//                       overflow: "auto",
//                     }}
//                   >
//                     {personalizeContentForPreview(emailData.body)}
//                   </div>
//                   {contacts.length > 1 && (
//                     <div
//                       style={{
//                         marginTop: "12px",
//                         fontSize: "11px",
//                         color: "#5f6368",
//                         fontStyle: "italic",
//                       }}
//                     >
//                       Note: Each email will be personalized with the individual
//                       HR contact's name
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div style={styles.footer}>
//           <button
//             onClick={onClose}
//             style={{
//               ...styles.button,
//               ...styles.secondaryButton,
//             }}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSendEmails}
//             disabled={
//               sending || contacts.length === 0 || !emailData.companyName.trim()
//             }
//             style={{
//               ...styles.button,
//               ...styles.primaryButton,
//               opacity:
//                 contacts.length > 0 && emailData.companyName.trim() ? 1 : 0.5,
//             }}
//           >
//             {sending ? "Sending..." : `Send to ${contacts.length} Contact(s)`}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ColdEmailModal;

import React, { useState, useEffect } from "react";
import { sendCustomEmails } from "../services/coldEmailService";
import "../CSS/ColdEmailModal.css";

const ColdEmailModal = ({ isOpen, onClose, coldEmail, companyName }) => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    title: "",
  });
  const [candidateInfo, setCandidateInfo] = useState({
    candidateName: "Mahaboob Pasha Mohammad",
    candidateEmail: "mahaboobpashamohammad8@gmail.com",
    candidatePhone: "3143056056",
  });
  const [emailData, setEmailData] = useState({
    subject: "",
    body: "",
    companyName: companyName || "",
    hiringManagerName: "Hiring Manager",
  });
  const [attachments, setAttachments] = useState([]);
  const [sending, setSending] = useState(false);

  // Initialize email data when modal opens
  useEffect(() => {
    if (isOpen && coldEmail) {
      const emailSubject =
        coldEmail.match(/Subject:\s*(.*)/i)?.[1]?.trim() || "Job Application";
      const emailBody = coldEmail.replace(/Subject:.*\n?/i, "").trim();

      setEmailData({
        subject: emailSubject,
        body: emailBody,
        companyName: companyName || "",
        hiringManagerName: "Hiring Manager",
      });
    }
  }, [isOpen, coldEmail, companyName]);

  const addContact = () => {
    if (newContact.name && newContact.email) {
      const contact = {
        name: newContact.title
          ? `${newContact.name} (${newContact.title})`
          : newContact.name,
        email: newContact.email,
        company: emailData.companyName,
      };

      setContacts([...contacts, contact]);
      setNewContact({ name: "", email: "", title: "" });
    }
  };

  const removeContact = (index) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleFileAttachment = (event) => {
    const files = Array.from(event.target.files);
    const maxSize = 25 * 1024 * 1024; // 25MB limit
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        alert(`File "${file.name}" is too large. Maximum size is 25MB.`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        alert(
          `File "${file.name}" type not supported. Please use PDF, DOC, DOCX, or TXT files.`
        );
        return false;
      }
      return true;
    });

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(",")[1];
        setAttachments((prev) => [
          ...prev,
          {
            name: file.name,
            type: file.type,
            size: file.size,
            base64: base64,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const personalizeContentForPreview = (content) => {
    const firstContactName =
      contacts.length > 0
        ? contacts[0].name.replace(/\s*\([^)]*\)/g, "").trim()
        : emailData.hiringManagerName;

    return content
      .replace(/\[CANDIDATE_NAME\]/g, candidateInfo.candidateName)
      .replace(/\{CANDIDATE_NAME\}/g, candidateInfo.candidateName)
      .replace(/\[RECIPIENT_NAME\]/g, firstContactName)
      .replace(/\{RECIPIENT_NAME\}/g, firstContactName)
      .replace(/\[HIRING_MANAGER\]/g, firstContactName)
      .replace(/\{HIRING_MANAGER\}/g, firstContactName)
      .replace(/\[Hiring Manager's Name\]/g, firstContactName)
      .replace(/Hiring Manager's Name/g, firstContactName)
      .replace(/\[COMPANY_NAME\]/g, emailData.companyName)
      .replace(/\{COMPANY_NAME\}/g, emailData.companyName)
      .replace(/\[Company Name\]/g, emailData.companyName)
      .replace(/Company Name/g, emailData.companyName)
      .replace(/\[company\s*name\]/gi, emailData.companyName)
      .replace(/\[hiring\s*manager\]/gi, firstContactName)
      .replace(/\[recipient\s*name\]/gi, firstContactName);
  };

  const handleSendEmails = async () => {
    if (contacts.length === 0) {
      alert("Please add at least one HR contact.");
      return;
    }

    if (!emailData.companyName.trim()) {
      alert("Please enter the company name.");
      return;
    }

    setSending(true);
    try {
      // Send the original template content, let backend handle personalization
      const response = await sendCustomEmails({
        candidateName: candidateInfo.candidateName,
        candidateEmail: candidateInfo.candidateEmail,
        candidatePhone: candidateInfo.candidatePhone,
        companyName: emailData.companyName,
        customSubject: emailData.subject, // Send original template
        customBody: emailData.body, // Send original template
        selectedContacts: contacts,
        attachments: attachments,
      });

      if (response.data.status === "success") {
        alert(
          `✅ Success! ${response.data.successCount} emails sent successfully out of ${response.data.totalEmails} total emails!`
        );
        onClose();
        setContacts([]);
        setAttachments([]);
      } else {
        alert(
          `❌ ${
            response.data.message ||
            "Some emails failed to send. Check console for details."
          }`
        );
      }
    } catch (error) {
      console.error("Send error:", error);

      if (error.response) {
        alert(
          `❌ Backend error: ${error.response.data.message || "Unknown error"}`
        );
      } else if (error.request) {
        alert(
          "❌ Cannot connect to backend. Make sure Spring Boot is running on port 8080."
        );
      } else {
        alert(`❌ Error: ${error.message}`);
      }
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">New Message</h2>
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          <div className="modal-grid">
            {/* Left Column */}
            <div>
              {/* Candidate Info */}
              <div className="modal-section">
                <h3 className="section-title">Your Information</h3>
                <div className="input-grid">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={candidateInfo.candidateName}
                    onChange={(e) =>
                      setCandidateInfo({
                        ...candidateInfo,
                        candidateName: e.target.value,
                      })
                    }
                    className="modal-input"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={candidateInfo.candidateEmail}
                    onChange={(e) =>
                      setCandidateInfo({
                        ...candidateInfo,
                        candidateEmail: e.target.value,
                      })
                    }
                    className="modal-input"
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone"
                    value={candidateInfo.candidatePhone}
                    onChange={(e) =>
                      setCandidateInfo({
                        ...candidateInfo,
                        candidatePhone: e.target.value,
                      })
                    }
                    className="modal-input"
                  />
                </div>
              </div>

              {/* Company Info */}
              <div className="modal-section">
                <h3 className="section-title">Company Information</h3>
                <div className="input-grid">
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={emailData.companyName}
                    onChange={(e) =>
                      setEmailData({
                        ...emailData,
                        companyName: e.target.value,
                      })
                    }
                    className="modal-input"
                  />
                </div>
              </div>

              {/* Add HR Contacts */}
              <div className="modal-section">
                <h3 className="section-title">Add HR Contacts</h3>
                <div className="input-grid contact-inputs">
                  <input
                    type="text"
                    placeholder="HR Name"
                    value={newContact.name}
                    onChange={(e) =>
                      setNewContact({ ...newContact, name: e.target.value })
                    }
                    className="modal-input"
                  />
                  <input
                    type="email"
                    placeholder="HR Email"
                    value={newContact.email}
                    onChange={(e) =>
                      setNewContact({ ...newContact, email: e.target.value })
                    }
                    className="modal-input"
                  />
                  <input
                    type="text"
                    placeholder="Job Title (optional)"
                    value={newContact.title}
                    onChange={(e) =>
                      setNewContact({ ...newContact, title: e.target.value })
                    }
                    className="modal-input"
                  />
                </div>
                <button
                  onClick={addContact}
                  disabled={!newContact.name || !newContact.email}
                  className={`modal-button success-button ${
                    !newContact.name || !newContact.email ? "disabled" : ""
                  }`}
                >
                  Add Contact
                </button>
              </div>

              {/* Contact List */}
              {contacts.length > 0 && (
                <div className="modal-section">
                  <h3 className="section-title">
                    HR Contacts ({contacts.length})
                  </h3>
                  <div className="contact-list">
                    {contacts.map((contact, index) => (
                      <div key={index} className="contact-item">
                        <div>
                          <div className="contact-name">{contact.name}</div>
                          <div className="contact-email">{contact.email}</div>
                        </div>
                        <button
                          onClick={() => removeContact(index)}
                          className="remove-button"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div>
              {/* Email Editor */}
              <div className="modal-section">
                <h3 className="section-title">Email Content</h3>
                <div className="email-field">
                  <label className="field-label">Subject:</label>
                  <input
                    type="text"
                    value={emailData.subject}
                    onChange={(e) =>
                      setEmailData({ ...emailData, subject: e.target.value })
                    }
                    className="modal-input"
                  />
                </div>
                <div className="email-field">
                  <label className="field-label">Body:</label>
                  <textarea
                    value={emailData.body}
                    onChange={(e) =>
                      setEmailData({ ...emailData, body: e.target.value })
                    }
                    rows="10"
                    className="modal-textarea"
                  />
                </div>
                <div className="tip">
                  💡 Use placeholders: [CANDIDATE_NAME], [RECIPIENT_NAME],
                  [COMPANY_NAME], [HIRING_MANAGER]
                </div>
              </div>

              {/* File Attachments */}
              <div className="modal-section">
                <h3 className="section-title">Attachments</h3>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileAttachment}
                  className="file-input"
                />
                <div className="file-help">
                  Supported: PDF, DOC, DOCX, TXT (Max 25MB each)
                </div>

                {attachments.length > 0 && (
                  <div>
                    <h4 className="attachment-title">
                      Attached Files ({attachments.length})
                    </h4>
                    {attachments.map((file, index) => (
                      <div key={index} className="attachment-item">
                        <div>
                          <div className="attachment-name">{file.name}</div>
                          <div className="attachment-size">
                            {formatFileSize(file.size)}
                          </div>
                        </div>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="remove-button"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="modal-section">
                <h3 className="section-title">Preview (Sample)</h3>
                <div className="email-preview">
                  <div className="preview-field">
                    <strong>To:</strong>{" "}
                    {contacts.length > 0 ? contacts[0].email : "HR Email"}
                  </div>
                  <div className="preview-field">
                    <strong>Subject:</strong>{" "}
                    {personalizeContentForPreview(emailData.subject)}
                  </div>
                  <div className="preview-body">
                    {personalizeContentForPreview(emailData.body)}
                  </div>
                  {contacts.length > 1 && (
                    <div className="preview-note">
                      Note: Each email will be personalized with the individual
                      HR contact's name
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="modal-button secondary-button">
            Cancel
          </button>
          <button
            onClick={handleSendEmails}
            disabled={
              sending || contacts.length === 0 || !emailData.companyName.trim()
            }
            className={`modal-button primary-button ${
              contacts.length > 0 && emailData.companyName.trim()
                ? ""
                : "disabled"
            }`}
          >
            {sending ? "Sending..." : `Send to ${contacts.length} Contact(s)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColdEmailModal;
