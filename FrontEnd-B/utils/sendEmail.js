// Resume-BackEnd/utils/sendEmail.js

import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mahaboobpashamohammad8@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD, // Use app password
  },
});

router.post("/send-email", async (req, res) => {
  try {
    const { to, subject, text, attachmentName, attachmentBase64 } = req.body;

    if (!to || !subject || !text) {
      return res.status(400).json({ message: "❌ Missing required fields" });
    }

    const mailOptions = {
      from: "mahaboobpashamohammad8@gmail.com",
      to,
      subject,
      text,
      attachments: attachmentBase64
        ? [
            {
              filename: attachmentName || "attachment.pdf",
              content: Buffer.from(attachmentBase64, "base64"),
              contentType: "application/pdf",
            },
          ]
        : [],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "✅ Email sent successfully" });
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    res.status(500).json({ message: "❌ Failed to send email" });
  }
});

export default router;
