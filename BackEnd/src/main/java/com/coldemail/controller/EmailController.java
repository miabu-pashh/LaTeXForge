package com.coldemail.controller;

import com.coldemail.model.EmailRequest;
import com.coldemail.model.EmailTemplate;
import com.coldemail.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.coldemail.service.EmailTemplateService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "http://localhost:3000")
public class EmailController {
    
    @Autowired
    private EmailService emailService;

    @Autowired
    private EmailTemplateService emailTemplateService;


    @PostMapping("/send-single")
    public ResponseEntity<Map<String, String>> sendSingleEmail(@RequestBody EmailRequest emailRequest) {
        Map<String, String> response = new HashMap<>();
        
        try {
            // Send to first recipient only
            String recipient = emailRequest.getRecipients().get(0);
            emailService.sendSimpleEmail(recipient, emailRequest.getSubject(), emailRequest.getBody());
            
            response.put("status", "success");
            response.put("message", "Email sent successfully to " + recipient);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to send email: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/send-bulk")
    public ResponseEntity<Map<String, String>> sendBulkEmails(@RequestBody EmailRequest emailRequest) {
        Map<String, String> response = new HashMap<>();
        
        try {
            emailService.sendBulkEmails(
                emailRequest.getRecipients(), 
                emailRequest.getSubject(), 
                emailRequest.getBody()
            );
            
            response.put("status", "success");
            response.put("message", "Bulk emails sent successfully to " + emailRequest.getRecipients().size() + " recipients");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to send bulk emails: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/send-personalized")
    public ResponseEntity<Map<String, String>> sendPersonalizedEmails(@RequestBody EmailRequest emailRequest) {
        Map<String, String> response = new HashMap<>();
        
        try {
            emailService.sendPersonalizedBulkEmails(
                emailRequest.getRecipients(), 
                emailRequest.getSubject(), 
                emailRequest.getBody()
            );
            
            response.put("status", "success");
            response.put("message", "Personalized emails sent successfully to " + emailRequest.getRecipients().size() + " recipients");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to send personalized emails: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> testEmailConfiguration() {
        Map<String, String> response = new HashMap<>();
        
        try {
            // Send a test email to yourself
            emailService.sendSimpleEmail(
                "mahaboobpashamohammad8@gmail.com", // Replace with your email
                "Test Email from Cold Email App", 
                "This is a test email to verify the configuration is working properly."
            );
            
            response.put("status", "success");
            response.put("message", "Test email sent successfully!");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Email configuration test failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    @GetMapping("/test-config")
public ResponseEntity<Map<String, String>> testConfig() {
    Map<String, String> response = new HashMap<>();
    
    try {
        // Just return configuration status without sending email
        response.put("status", "success");
        response.put("message", "Email service is configured");
        response.put("host", "smtp.gmail.com");
        response.put("port", "587");
        return ResponseEntity.ok(response);
        
    } catch (Exception e) {
        response.put("status", "error");
        response.put("message", "Configuration error: " + e.getMessage());
        return ResponseEntity.badRequest().body(response);
    }
}
@GetMapping("/simple-test")
public ResponseEntity<String> simpleTest() {
    try {
        // Test sending email to yourself
        emailService.sendSimpleEmail(
            "mahaboobpashamohammad8@gmail.com", // Replace with your email
            "Test from Cold Email App", 
            "Hello! This is a test email from your Cold Email application."
        );
        return ResponseEntity.ok("Test email sent successfully!");
        
    } catch (Exception e) {
        return ResponseEntity.badRequest().body("Failed to send email: " + e.getMessage());
    }
}
@PostMapping("/send-with-template")
public ResponseEntity<Map<String, String>> sendEmailWithTemplate(@RequestBody Map<String, Object> request) {
    Map<String, String> response = new HashMap<>();
    
    try {
        String templateName = (String) request.get("templateName");
        String candidateName = (String) request.get("candidateName");
        String candidateEmail = (String) request.get("candidateEmail");
        String candidatePhone = (String) request.get("candidatePhone");
        String companyName = (String) request.get("companyName");
        List<String> recipients = (List<String>) request.get("recipients");
        
        // Get template
        EmailTemplate template = emailTemplateService.getTemplateByName(templateName);
        if (template == null) {
            response.put("status", "error");
            response.put("message", "Template not found");
            return ResponseEntity.badRequest().body(response);
        }
        
        // Send personalized emails to each recipient
        int successCount = 0;
        for (String recipient : recipients) {
            try {
                // Extract recipient name from email for personalization
                String recipientName = extractNameFromEmail(recipient);
                
                // Personalize template
                String personalizedSubject = emailTemplateService.personalizeTemplate(
                    template.getSubject(), candidateName, candidateEmail, candidatePhone, recipientName, companyName
                );
                
                String personalizedBody = emailTemplateService.personalizeTemplate(
                    template.getBody(), candidateName, candidateEmail, candidatePhone, recipientName, companyName
                );
                
                // Send email
                emailService.sendSimpleEmail(recipient, personalizedSubject, personalizedBody);
                successCount++;
                
                // Add delay between emails
                Thread.sleep(3000); // 3 seconds delay
                
            } catch (Exception e) {
                System.err.println("Failed to send email to: " + recipient + " - " + e.getMessage());
            }
        }
        
        response.put("status", "success");
        response.put("message", "Sent " + successCount + " out of " + recipients.size() + " emails successfully");
        return ResponseEntity.ok(response);
        
    } catch (Exception e) {
        response.put("status", "error");
        response.put("message", "Failed to send emails: " + e.getMessage());
        return ResponseEntity.badRequest().body(response);
    }
}

// Add this helper method to EmailController
private String extractNameFromEmail(String email) {
    String localPart = email.split("@")[0];
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

@PostMapping("/send-custom")
public ResponseEntity<Map<String, String>> sendCustomEmails(@RequestBody Map<String, Object> request) {
    Map<String, String> response = new HashMap<>();
    
    try {
        String candidateName = (String) request.get("candidateName");
        String candidateEmail = (String) request.get("candidateEmail");
        String candidatePhone = (String) request.get("candidatePhone");
        String companyName = (String) request.get("companyName");
        String customSubject = (String) request.get("customSubject");
        String customBody = (String) request.get("customBody");
        List<Map<String, Object>> selectedContacts = (List<Map<String, Object>>) request.get("selectedContacts");
        List<Map<String, Object>> attachments = (List<Map<String, Object>>) request.get("attachments");
        
        // Log received data
        System.out.println("Received custom email request:");
        System.out.println("Company: " + companyName);
        System.out.println("Subject: " + customSubject);
        System.out.println("Recipients: " + selectedContacts.size());
        System.out.println("Attachments: " + (attachments != null ? attachments.size() : 0));
        
        // Send personalized emails to each recipient
        int successCount = 0;
        int totalEmails = selectedContacts.size();
        Map<String, String> emailResults = new HashMap<>();
        
        for (Map<String, Object> contactData : selectedContacts) {
            try {
                String recipientEmail = (String) contactData.get("email");
                String recipientFullName = (String) contactData.get("name");
                
                // Extract clean recipient name (remove job title if present)
                String recipientName = recipientFullName;
                if (recipientName.contains("(")) {
                    recipientName = recipientName.substring(0, recipientName.indexOf("(")).trim();
                }
                
                System.out.println("Personalizing for: " + recipientName + " at " + companyName);
                
                // Personalize the custom content for THIS specific recipient
                String personalizedSubject = personalizeCustomContent(customSubject, candidateName, candidateEmail, candidatePhone, recipientName, companyName);
                String personalizedBody = personalizeCustomContent(customBody, candidateName, candidateEmail, candidatePhone, recipientName, companyName);
                
                System.out.println("Personalized subject: " + personalizedSubject);
                System.out.println("Sending to: " + recipientEmail);
                
                // Send email with or without attachments
                if (attachments != null && !attachments.isEmpty()) {
                    emailService.sendEmailWithAttachments(recipientEmail, personalizedSubject, personalizedBody, attachments);
                } else {
                    emailService.sendSimpleEmail(recipientEmail, personalizedSubject, personalizedBody);
                }
                
                successCount++;
                emailResults.put(recipientEmail, "success");
                
                System.out.println("Custom email sent successfully to: " + recipientEmail);
                
                // Add delay between emails to avoid spam detection
                if (successCount < totalEmails) {
                    Thread.sleep(3000); // 3 seconds delay
                }
                
            } catch (Exception e) {
                String recipientEmail = (String) contactData.get("email");
                emailResults.put(recipientEmail, "failed: " + e.getMessage());
                System.err.println("Failed to send email to: " + recipientEmail + " - " + e.getMessage());
                e.printStackTrace();
            }
        }
        
        response.put("status", "success");
        response.put("totalEmails", String.valueOf(totalEmails));
        response.put("successCount", String.valueOf(successCount));
        response.put("failureCount", String.valueOf(totalEmails - successCount));
        response.put("message", "Custom email campaign completed! " + successCount + "/" + totalEmails + " emails sent successfully.");
        
        return ResponseEntity.ok(response);
        
    } catch (Exception e) {
        response.put("status", "error");
        response.put("message", "Failed to send custom emails: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.badRequest().body(response);
    }
}
// Helper method for personalizing custom content
private String personalizeCustomContent(String content, String candidateName, String candidateEmail, 
                                      String candidatePhone, String recipientName, String companyName) {
    if (content == null) {
        return "";
    }
    
    return content
            // Handle all variations of candidate name
            .replace("[CANDIDATE_NAME]", candidateName != null ? candidateName : "Your Name")
            .replace("{CANDIDATE_NAME}", candidateName != null ? candidateName : "Your Name")
            .replace("CANDIDATE_NAME", candidateName != null ? candidateName : "Your Name")
            
            // Handle all variations of candidate email
            .replace("[CANDIDATE_EMAIL]", candidateEmail != null ? candidateEmail : "your.email@example.com")
            .replace("{CANDIDATE_EMAIL}", candidateEmail != null ? candidateEmail : "your.email@example.com")
            
            // Handle all variations of candidate phone
            .replace("[CANDIDATE_PHONE]", candidatePhone != null ? candidatePhone : "Your Phone")
            .replace("{CANDIDATE_PHONE}", candidatePhone != null ? candidatePhone : "Your Phone")
            
            // Handle all variations of recipient/hiring manager name
            .replace("[RECIPIENT_NAME]", recipientName != null ? recipientName : "Hiring Manager")
            .replace("{RECIPIENT_NAME}", recipientName != null ? recipientName : "Hiring Manager")
            .replace("[HIRING_MANAGER]", recipientName != null ? recipientName : "Hiring Manager")
            .replace("{HIRING_MANAGER}", recipientName != null ? recipientName : "Hiring Manager")
            .replace("[Hiring Manager's Name]", recipientName != null ? recipientName : "Hiring Manager")
            .replace("Hiring Manager's Name", recipientName != null ? recipientName : "Hiring Manager")
            
            // Handle all variations of company name
            .replace("[COMPANY_NAME]", companyName != null ? companyName : "Your Company")
            .replace("{COMPANY_NAME}", companyName != null ? companyName : "Your Company")
            .replace("[Company Name]", companyName != null ? companyName : "Your Company")
            .replace("Company Name", companyName != null ? companyName : "Your Company")
            
            // Handle case-insensitive replacements
            .replaceAll("(?i)\\[company\\s*name\\]", companyName != null ? companyName : "Your Company")
            .replaceAll("(?i)\\[hiring\\s*manager\\]", recipientName != null ? recipientName : "Hiring Manager")
            .replaceAll("(?i)\\[recipient\\s*name\\]", recipientName != null ? recipientName : "Hiring Manager");
}
// @GetMapping("/debug")
// public ResponseEntity<Map<String, String>> debugEmail() {
//     Map<String, String> response = new HashMap<>();
    
//     response.put("mail.host", "smtp.gmail.com");
//     response.put("mail.port", "587");
//     response.put("from.email", fromEmail);
//     response.put("from.name", fromName);
//     response.put("smtp.auth", "true");
//     response.put("starttls.enable", "true");
    
//     return ResponseEntity.ok(response);
// }
}