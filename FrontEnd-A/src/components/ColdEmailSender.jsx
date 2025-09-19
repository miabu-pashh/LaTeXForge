import React, { useState } from "react";
import { testColdEmailBackend } from "../services/coldEmailService";
import ColdEmailModal from "./ColdEmailModal";

const ColdEmailSender = ({ coldEmail, companyName }) => {
  const [backendStatus, setBackendStatus] = useState("checking");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Test backend connection when component mounts
  React.useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      await testColdEmailBackend();
      setBackendStatus("connected");
      console.log("✅ Cold email backend connected");
    } catch (error) {
      setBackendStatus("disconnected");
      console.error("❌ Cold email backend disconnected:", error);
    }
  };

  const handleSendColdEmail = () => {
    if (backendStatus !== "connected") {
      alert(
        "❌ Cold email backend is not connected. Please make sure the Spring Boot server is running on port 8080."
      );
      return;
    }

    // Open the cold email modal
    setShowModal(true);
  };

  return (
    <>
      <div style={{ marginTop: "10px" }}>
        {/* Backend Status Indicator */}
        <div
          style={{
            fontSize: "12px",
            marginBottom: "8px",
            color: backendStatus === "connected" ? "green" : "red",
          }}
        >
          {backendStatus === "checking" && "🔄 Checking cold email backend..."}
          {backendStatus === "connected" && "✅ Cold email backend connected"}
          {backendStatus === "disconnected" &&
            "❌ Cold email backend disconnected"}
        </div>

        {/* Send Cold Email Button */}
        <button
          className="send-email-btn"
          onClick={handleSendColdEmail}
          disabled={loading || !coldEmail}
          style={{
            backgroundColor:
              backendStatus === "connected" ? "#3b82f6" : "#6b7280",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: backendStatus === "connected" ? "pointer" : "not-allowed",
          }}
        >
          {loading ? "Loading..." : "🚀 Send via Cold Email App"}
        </button>
      </div>

      {/* Cold Email Modal */}
      <ColdEmailModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        coldEmail={coldEmail}
        companyName={companyName}
      />
    </>
  );
};

export default ColdEmailSender;
