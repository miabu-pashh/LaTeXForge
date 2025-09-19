import axios from "axios";

const COLD_EMAIL_API_BASE = "http://localhost:8080/api";

// Create axios instance for cold email backend
const coldEmailApi = axios.create({
  baseURL: COLD_EMAIL_API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Test backend connection
export const testColdEmailBackend = () => {
  return coldEmailApi.get("/test/hello");
};

// Get available email templates
export const getEmailTemplates = () => {
  return coldEmailApi.get("/workflow/templates");
};

// Preview email with personalization
export const previewEmail = (data) => {
  return coldEmailApi.post("/workflow/preview-email", data);
};

// Send cold emails using templates
export const sendColdEmails = (data) => {
  return coldEmailApi.post("/workflow/send-cold-emails", data);
};

// Send custom emails (NEW METHOD)
export const sendCustomEmails = (data) => {
  return coldEmailApi.post("/email/send-custom", data);
};

export default coldEmailApi;
