package com.emailmanager.controller;

import com.emailmanager.model.Email;
import com.emailmanager.model.EmailCategory;
import com.emailmanager.model.Priority;
import com.emailmanager.service.EmailManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;  // ADD THIS LINE
import java.util.List;
import java.util.Map;
/**
 * Email Controller - REST API endpoints for email operations
 */
@RestController
@RequestMapping("/api/emails")
@CrossOrigin(origins = "http://localhost:3000") // For React frontend
public class EmailManagerController {
    
    @Autowired
    private EmailManagerService emailManagerService;
    
    /**
     * Get all emails with pagination and optional filtering
     * GET /api/emails?page=0&size=20&category=INTERVIEW&sort=receivedDate,desc
     */
    @GetMapping
    public ResponseEntity<Page<Email>> getAllEmails(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "receivedDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) EmailCategory category,
            @RequestParam(required = false) Priority priority) {
        
        // Create sort object
        Sort sort = sortDir.equalsIgnoreCase("desc") 
            ? Sort.by(sortBy).descending() 
            : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Email> emails;
        
        // Apply filters if provided
        if (category != null && priority != null) {
            emails = emailManagerService.getEmailsByCategoryAndPriority(category, priority, pageable);
        } else if (category != null) {
            emails = emailManagerService.getEmailsByCategory(category, pageable);
        } else if (priority != null) {
            emails = emailManagerService.getEmailsByPriority(priority, pageable);
        } else {
            emails = emailManagerService.getAllEmails(pageable);
        }
        
        return ResponseEntity.ok(emails);
    }
    
    /**
     * Get email by ID
     * GET /api/emails/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<Email> getEmailById(@PathVariable Long id) {
        return emailManagerService.getEmailById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Mark email as read
     * PUT /api/emails/1/mark-read
     */
    @PutMapping("/{id}/mark-read")
    public ResponseEntity<Void> markEmailAsRead(@PathVariable Long id) {
        emailManagerService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
    
    /**
     * Search emails by keyword
     * GET /api/emails/search?q=interview
     */
    @GetMapping("/search")
    public ResponseEntity<List<Email>> searchEmails(@RequestParam String q) {
        List<Email> emails = emailManagerService.searchEmails(q);
        return ResponseEntity.ok(emails);
    }
    
    /**
     * Get emails by sender
     * GET /api/emails/by-sender?sender=recruiter@company.com
     */
    @GetMapping("/by-sender")
    public ResponseEntity<Page<Email>> getEmailsBySender(
            @RequestParam String sender,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, 
            Sort.by("receivedDate").descending());
        
        Page<Email> emails = emailManagerService.getEmailsBySender(sender, pageable);
        return ResponseEntity.ok(emails);
    }
    
    /**
     * Get dashboard statistics
     * GET /api/emails/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = emailManagerService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Manually process/categorize an email (for testing)
     * POST /api/emails/process
     */
    @PostMapping("/process")
    public ResponseEntity<Email> processEmail(@RequestBody EmailProcessRequest request) {
        Email processedEmail = emailManagerService.processEmail(
            request.getMessageId(),
            request.getSubject(),
            request.getSender(),
            request.getRecipient(),
            request.getContent(),
            request.getReceivedDate()
        );
        return ResponseEntity.ok(processedEmail);
    }
    
    /**
     * Get email categories (for frontend dropdowns)
     * GET /api/emails/categories
     */
    @GetMapping("/categories")
    public ResponseEntity<EmailCategory[]> getEmailCategories() {
        return ResponseEntity.ok(EmailCategory.values());
    }
    
    /**
     * Get priority levels (for frontend dropdowns)
     * GET /api/emails/priorities
     */
    @GetMapping("/priorities")
    public ResponseEntity<Priority[]> getPriorities() {
        return ResponseEntity.ok(Priority.values());
    }
    /**
 * Manually fetch emails from Gmail
 * POST /api/emails/fetch-gmail
 */
@PostMapping("/fetch-gmail")
public ResponseEntity<Map<String, Object>> fetchGmailEmails() {
    Map<String, Object> response = new HashMap<>();
    
    try {
        emailManagerService.fetchEmailsFromGmail();
        response.put("success", true);
        response.put("message", "Gmail fetch completed");
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        response.put("success", false);
        response.put("message", "Error: " + e.getMessage());
        return ResponseEntity.ok(response);
    }
}
}

/**
 * DTO for processing emails manually (testing purposes)
 */
class EmailProcessRequest {
    private String messageId;
    private String subject;
    private String sender;
    private String recipient;
    private String content;
    private java.time.LocalDateTime receivedDate;
    
    // Constructors
    public EmailProcessRequest() {}
    
    // Getters and Setters
    public String getMessageId() { return messageId; }
    public void setMessageId(String messageId) { this.messageId = messageId; }
    
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    
    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }
    
    public String getRecipient() { return recipient; }
    public void setRecipient(String recipient) { this.recipient = recipient; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public java.time.LocalDateTime getReceivedDate() { return receivedDate; }
    public void setReceivedDate(java.time.LocalDateTime receivedDate) { this.receivedDate = receivedDate; }
}