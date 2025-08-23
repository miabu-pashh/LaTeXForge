package com.coldemail.controller;

import com.coldemail.model.EmailTemplate;
import com.coldemail.model.HRContact;
import com.coldemail.service.EmailService;
import com.coldemail.service.EmailTemplateService;
import com.coldemail.service.HRService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/workflow")
@CrossOrigin(origins = "http://localhost:3000")
public class ColdEmailWorkflowController {
    
    @Autowired
    private HRService hrService;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private EmailTemplateService emailTemplateService;
    
    // Step 1: Search HR contacts for a company
    @GetMapping("/search-hr/{companyName}")
    public ResponseEntity<Map<String, Object>> searchHRContacts(@PathVariable String companyName) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<HRContact> hrContacts = hrService.generateHRContactsForCompany(companyName);
            
            response.put("status", "success");
            response.put("companyName", companyName);
            response.put("hrContacts", hrContacts);
            response.put("count", hrContacts.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to search HR contacts: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // Step 2: Get available email templates
    @GetMapping("/templates")
    public ResponseEntity<Map<String, Object>> getEmailTemplates() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<EmailTemplate> templates = emailTemplateService.getAllTemplates();
            
            response.put("status", "success");
            response.put("templates", templates);
            response.put("count", templates.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to get templates: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // Step 3: Preview personalized email before sending
    @PostMapping("/preview-email")
    public ResponseEntity<Map<String, Object>> previewEmail(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String templateName = (String) request.get("templateName");
            String candidateName = (String) request.get("candidateName");
            String candidateEmail = (String) request.get("candidateEmail");
            String candidatePhone = (String) request.get("candidatePhone");
            String companyName = (String) request.get("companyName");
            String sampleRecipient = (String) request.get("sampleRecipient");
            
            // Get template
            EmailTemplate template = emailTemplateService.getTemplateByName(templateName);
            if (template == null) {
                response.put("status", "error");
                response.put("message", "Template not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Extract recipient name from sample email
            String recipientName = extractNameFromEmail(sampleRecipient);
            
            // Personalize template
            String personalizedSubject = emailTemplateService.personalizeTemplate(
                template.getSubject(), candidateName, candidateEmail, candidatePhone, recipientName, companyName
            );
            
            String personalizedBody = emailTemplateService.personalizeTemplate(
                template.getBody(), candidateName, candidateEmail, candidatePhone, recipientName, companyName
            );
            
            response.put("status", "success");
            response.put("subject", personalizedSubject);
            response.put("body", personalizedBody);
            response.put("recipientName", recipientName);
            response.put("sampleRecipient", sampleRecipient);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to preview email: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    
    // Step 4: Send cold emails to selected HR contacts
    @PostMapping("/send-cold-emails")
    public ResponseEntity<Map<String, Object>> sendColdEmails(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String templateName = (String) request.get("templateName");
            String candidateName = (String) request.get("candidateName");
            String candidateEmail = (String) request.get("candidateEmail");
            String candidatePhone = (String) request.get("candidatePhone");
            String companyName = (String) request.get("companyName");
            List<Map<String, Object>> selectedContacts = (List<Map<String, Object>>) request.get("selectedContacts");
            
            // Get template
            EmailTemplate template = emailTemplateService.getTemplateByName(templateName);
            if (template == null) {
                response.put("status", "error");
                response.put("message", "Template not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Send emails to selected contacts
            int successCount = 0;
            int totalEmails = selectedContacts.size();
            Map<String, String> emailResults = new HashMap<>();
            
            for (Map<String, Object> contactData : selectedContacts) {
                try {
                    String recipientEmail = (String) contactData.get("email");
                    String recipientName = (String) contactData.get("name");
                    
                    // Clean up recipient name (remove job title if present)
                    if (recipientName.contains("(")) {
                        recipientName = recipientName.substring(0, recipientName.indexOf("(")).trim();
                    }
                    
                    // Personalize template for this recipient
                    String personalizedSubject = emailTemplateService.personalizeTemplate(
                        template.getSubject(), candidateName, candidateEmail, candidatePhone, recipientName, companyName
                    );
                    
                    String personalizedBody = emailTemplateService.personalizeTemplate(
                        template.getBody(), candidateName, candidateEmail, candidatePhone, recipientName, companyName
                    );
                    
                    // Send email
                    emailService.sendSimpleEmail(recipientEmail, personalizedSubject, personalizedBody);
                    
                    successCount++;
                    emailResults.put(recipientEmail, "success");
                    
                    System.out.println("Email sent successfully to: " + recipientEmail);
                    
                    // Add delay between emails to avoid spam detection
                    if (successCount < totalEmails) { // Don't delay after the last email
                        Thread.sleep(3000); // 3 seconds delay
                    }
                    
                } catch (Exception e) {
                    String recipientEmail = (String) contactData.get("email");
                    emailResults.put(recipientEmail, "failed: " + e.getMessage());
                    System.err.println("Failed to send email to: " + recipientEmail + " - " + e.getMessage());
                }
            }
            
            response.put("status", "success");
            response.put("totalEmails", totalEmails);
            response.put("successCount", successCount);
            response.put("failureCount", totalEmails - successCount);
            response.put("emailResults", emailResults);
            response.put("message", "Cold email campaign completed! " + successCount + "/" + totalEmails + " emails sent successfully.");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to send cold emails: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // Step 5: Complete workflow - search, preview, and send in one request
    @PostMapping("/complete-campaign")
    public ResponseEntity<Map<String, Object>> completeCampaign(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String companyName = (String) request.get("companyName");
            String templateName = (String) request.get("templateName");
            String candidateName = (String) request.get("candidateName");
            String candidateEmail = (String) request.get("candidateEmail");
            String candidatePhone = (String) request.get("candidatePhone");
            Integer maxEmails = (Integer) request.get("maxEmails"); // Optional limit
            
            if (maxEmails == null) {
                maxEmails = 5; // Default limit
            }
            
            // Step 1: Search HR contacts
            List<HRContact> hrContacts = hrService.generateHRContactsForCompany(companyName);
            
            // Step 2: Limit to maxEmails
            List<HRContact> selectedContacts = hrContacts.stream()
                    .limit(maxEmails)
                    .collect(Collectors.toList());
            
            // Step 3: Get template
            EmailTemplate template = emailTemplateService.getTemplateByName(templateName);
            if (template == null) {
                response.put("status", "error");
                response.put("message", "Template not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Step 4: Send emails
            int successCount = 0;
            Map<String, String> emailResults = new HashMap<>();
            
            for (HRContact contact : selectedContacts) {
                try {
                    String recipientName = contact.getName();
                    if (recipientName.contains("(")) {
                        recipientName = recipientName.substring(0, recipientName.indexOf("(")).trim();
                    }
                    
                    String personalizedSubject = emailTemplateService.personalizeTemplate(
                        template.getSubject(), candidateName, candidateEmail, candidatePhone, recipientName, companyName
                    );
                    
                    String personalizedBody = emailTemplateService.personalizeTemplate(
                        template.getBody(), candidateName, candidateEmail, candidatePhone, recipientName, companyName
                    );
                    
                    emailService.sendSimpleEmail(contact.getEmail(), personalizedSubject, personalizedBody);
                    
                    successCount++;
                    emailResults.put(contact.getEmail(), "success");
                    
                    if (successCount < selectedContacts.size()) {
                        Thread.sleep(3000); // 3 seconds delay
                    }
                    
                } catch (Exception e) {
                    emailResults.put(contact.getEmail(), "failed: " + e.getMessage());
                }
            }
            
            response.put("status", "success");
            response.put("companyName", companyName);
            response.put("templateUsed", templateName);
            response.put("totalContacts", hrContacts.size());
            response.put("emailsSent", successCount);
            response.put("emailResults", emailResults);
            response.put("message", "Campaign completed! Sent " + successCount + " emails to " + companyName + " HR team.");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Campaign failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // Helper method
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





    // Add these GET endpoints for easy testing
@GetMapping("/test-preview")
public ResponseEntity<Map<String, Object>> testPreview() {
    Map<String, Object> request = new HashMap<>();
    request.put("templateName", "software_engineer");
    request.put("candidateName", "Mahaboob Pasha Mohammad");
    request.put("candidateEmail", "mdmaibubpasha@gmail.com");
    request.put("candidatePhone", "3143056056");
    request.put("companyName", "Google");
    request.put("sampleRecipient", "john.smith@google.com");
    
    return previewEmail(request);
}

@GetMapping("/test-send")
public ResponseEntity<Map<String, Object>> testSend() {
    Map<String, Object> request = new HashMap<>();
    request.put("templateName", "software_engineer");
    request.put("candidateName", "Mahaboob Pasha Mohammad");
    request.put("candidateEmail", "mdmaibubpasha@gmail.com");
    request.put("candidatePhone", "3143056056");
    request.put("companyName", "Google");
    
    // Create selected contacts list
    List<Map<String, Object>> selectedContacts = new ArrayList<>();
    Map<String, Object> contact = new HashMap<>();
    contact.put("name", "Test Recipient");
    contact.put("email", "mdmaibubpasha@gmail.com"); // Send to yourself for testing
    contact.put("company", "Google");
    selectedContacts.add(contact);
    
    request.put("selectedContacts", selectedContacts);
    
    return sendColdEmails(request);
}

@GetMapping("/test-campaign")
public ResponseEntity<Map<String, Object>> testCampaign() {
    Map<String, Object> request = new HashMap<>();
    request.put("companyName", "Microsoft");
    request.put("templateName", "software_engineer");
    request.put("candidateName", "Mahaboob Pasha Mohammad");
    request.put("candidateEmail", "mdmaibubpasha@gmail.com");
    request.put("candidatePhone", "3143056056");
    request.put("maxEmails", 1); // Only send 1 email for testing
    
    return completeCampaign(request);
}
}