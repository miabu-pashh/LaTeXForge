package com.coldemail.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;

import java.util.List;
import java.util.Map;
import jakarta.mail.util.ByteArrayDataSource;
import java.util.Base64;
import java.util.List;
import java.util.Map;
@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${app.email.from}")
    private String fromEmail;
    
    @Value("${app.email.name}")
    private String fromName;
    
    public void sendSimpleEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            
            mailSender.send(message);
            System.out.println("Email sent successfully to: " + to);
            
        } catch (Exception e) {
            System.err.println("Failed to send email to: " + to);
            System.err.println("Error: " + e.getMessage());
            throw new RuntimeException("Failed to send email", e);
        }
    }
    
    public void sendHtmlEmail(String to, String subject, String htmlBody) throws MessagingException {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true means HTML
            
            mailSender.send(message);
            System.out.println("HTML Email sent successfully to: " + to);
            
        } catch (Exception e) {
            System.err.println("Failed to send HTML email to: " + to);
            System.err.println("Error: " + e.getMessage());
            throw new MessagingException("Failed to send HTML email", e);
        }
    }
    
    public void sendBulkEmails(List<String> recipients, String subject, String body) {
        System.out.println("Starting bulk email sending to " + recipients.size() + " recipients");
        
        int successCount = 0;
        int failureCount = 0;
        
        for (String recipient : recipients) {
            try {
                // Add delay between emails to avoid being flagged as spam
                Thread.sleep(2000); // 2 seconds delay
                
                sendSimpleEmail(recipient, subject, body);
                successCount++;
                
            } catch (Exception e) {
                failureCount++;
                System.err.println("Failed to send email to: " + recipient);
            }
        }
        
        System.out.println("Bulk email sending completed!");
        System.out.println("Success: " + successCount + ", Failures: " + failureCount);
    }
    
    public void sendPersonalizedBulkEmails(List<String> recipients, String subject, String bodyTemplate) {
        System.out.println("Starting personalized bulk email sending to " + recipients.size() + " recipients");
        
        for (String recipient : recipients) {
            try {
                // Add delay between emails
                Thread.sleep(2000); // 2 seconds delay
                
                // Personalize the email (extract name from email)
                String recipientName = extractNameFromEmail(recipient);
                String personalizedBody = bodyTemplate.replace("[RECIPIENT_NAME]", recipientName);
                
                sendSimpleEmail(recipient, subject, personalizedBody);
                
            } catch (Exception e) {
                System.err.println("Failed to send personalized email to: " + recipient);
            }
        }
        
        System.out.println("Personalized bulk email sending completed!");
    }
    
    private String extractNameFromEmail(String email) {
        // Extract name from email (before @)
        String localPart = email.split("@")[0];
        
        // Handle different formats: john.smith, johnsmith, j.smith
        if (localPart.contains(".")) {
            String[] parts = localPart.split("\\.");
            return capitalizeFirstLetter(parts[0]) + " " + capitalizeFirstLetter(parts[1]);
        } else {
            return capitalizeFirstLetter(localPart);
        }
    }
    
    private String capitalizeFirstLetter(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }

    public void sendEmailWithAttachments(String to, String subject, String body, List<Map<String, Object>> attachments) throws MessagingException {
    try {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true); // true = multipart
        
        helper.setFrom(fromEmail, fromName);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, false); // false = plain text
        
        // Add attachments
        if (attachments != null && !attachments.isEmpty()) {
            for (Map<String, Object> attachment : attachments) {
                String fileName = (String) attachment.get("name");
                String base64Data = (String) attachment.get("base64");
                
                if (fileName != null && base64Data != null) {
                    try {
                        // Decode base64 to byte array
                        byte[] decodedBytes = Base64.getDecoder().decode(base64Data);
                        
                        // Create ByteArrayDataSource
                        ByteArrayDataSource dataSource = new ByteArrayDataSource(decodedBytes, "application/octet-stream");
                        
                        // Add attachment
                        helper.addAttachment(fileName, dataSource);
                        
                        System.out.println("Added attachment: " + fileName + " (" + decodedBytes.length + " bytes)");
                        
                    } catch (Exception e) {
                        System.err.println("Failed to add attachment " + fileName + ": " + e.getMessage());
                    }
                }
            }
        }
        
        mailSender.send(message);
        System.out.println("Email with attachments sent successfully to: " + to);
        
    } catch (Exception e) {
        System.err.println("Failed to send email with attachments to: " + to);
        System.err.println("Error: " + e.getMessage());
        throw new MessagingException("Failed to send email with attachments", e);
    }
}
}