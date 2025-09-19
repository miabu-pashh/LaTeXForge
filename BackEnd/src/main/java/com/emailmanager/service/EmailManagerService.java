package com.emailmanager.service;

import com.emailmanager.model.*;
import com.emailmanager.repository.EmailRepository;
import com.emailmanager.repository.ReminderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

// Add these imports to your existing EmailService
import jakarta.mail.*;
import jakarta.mail.internet.MimeMessage;
import java.util.Properties;
import java.util.Date;
import java.time.ZoneId;
import org.springframework.beans.factory.annotation.Value;

import jakarta.mail.search.SearchTerm;
import jakarta.mail.search.ReceivedDateTerm;
import jakarta.mail.search.ComparisonTerm;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Optional;

/**
 * Email Processing Service - Core business logic for email categorization and processing
 */
@Service
@Transactional
public class EmailManagerService {
    
    @Autowired
    private EmailRepository emailRepository;
    
    @Autowired
    private ReminderRepository reminderRepository;

    // Add these fields to your existing EmailService class
@Value("${spring.mail.host:}")
private String mailHost;

@Value("${spring.mail.port:993}")
private String mailPort;

@Value("${spring.mail.username:}")
private String mailUsername;

@Value("${spring.mail.password:}")
private String mailPassword;
    
    // Keywords for automatic categorization
    private static final Map<EmailCategory, String[]> CATEGORY_KEYWORDS = new HashMap<>();
    
    static {
        CATEGORY_KEYWORDS.put(EmailCategory.INTERVIEW, new String[]{
            "interview", "call", "meeting", "zoom", "teams", "phone screen", 
            "technical interview", "final round", "onsite", "video call"
        });
        
        CATEGORY_KEYWORDS.put(EmailCategory.ASSESSMENT, new String[]{
            "assessment", "test", "coding challenge", "assignment", "evaluation",
            "technical challenge", "take home", "coding test", "hackkerrank", "leetcode"
        });
        
        CATEGORY_KEYWORDS.put(EmailCategory.FOLLOW_UP, new String[]{
            "follow up", "following up", "check in", "status update", "any updates",
            "heard back", "next steps", "timeline"
        });
        
        CATEGORY_KEYWORDS.put(EmailCategory.OFFER, new String[]{
            "offer", "congratulations", "pleased to extend", "job offer", 
            "welcome to", "start date", "compensation", "salary"
        });
        
        CATEGORY_KEYWORDS.put(EmailCategory.REJECTION, new String[]{
            "unfortunately", "not selected", "decided to move forward", 
            "other candidates", "not moving forward", "thank you for your interest"
        });
        
        CATEGORY_KEYWORDS.put(EmailCategory.JOB_APPLICATION, new String[]{
            "application received", "thank you for applying", "application status",
            "application update", "received your resume", "application confirmation"
        });
    }
    
    /**
     * Process and save a new email with automatic categorization
     */
    public Email processEmail(String messageId, String subject, String sender, 
                             String recipient, String content, LocalDateTime receivedDate) {
        
        // Check if email already exists
        Optional<Email> existingEmail = emailRepository.findByMessageId(messageId);
        if (existingEmail.isPresent()) {
            return existingEmail.get();
        }
        
        // Create new email
        Email email = new Email(messageId, subject, sender, recipient, content, receivedDate);
        
        // Automatic categorization
        email.setCategory(categorizeEmail(subject, content));
        email.setPriority(determinePriority(email.getCategory(), subject, content));
        
        // Save email
        Email savedEmail = emailRepository.save(email);
        
        // Create reminders if applicable
        createReminders(savedEmail);
        
        return savedEmail;
    }
    
    /**
     * Automatically categorize email based on content analysis
     */
    private EmailCategory categorizeEmail(String subject, String content) {
        String combinedText = (subject + " " + content).toLowerCase();
        
        // Check each category for keyword matches
        for (Map.Entry<EmailCategory, String[]> entry : CATEGORY_KEYWORDS.entrySet()) {
            for (String keyword : entry.getValue()) {
                if (combinedText.contains(keyword.toLowerCase())) {
                    return entry.getKey();
                }
            }
        }
        
        return EmailCategory.GENERAL;
    }
    
    /**
     * Determine email priority based on category and content urgency
     */
    private Priority determinePriority(EmailCategory category, String subject, String content) {
        String combinedText = (subject + " " + content).toLowerCase();
        
        // High priority keywords
        String[] urgentKeywords = {"urgent", "asap", "immediate", "today", "tomorrow", 
                                  "deadline", "final", "last chance"};
        
        for (String keyword : urgentKeywords) {
            if (combinedText.contains(keyword)) {
                return Priority.HIGH;
            }
        }
        
        // Category-based priority
        switch (category) {
            case INTERVIEW:
            case OFFER:
            case ASSESSMENT:
                return Priority.HIGH;
            case FOLLOW_UP:
            case JOB_APPLICATION:
                return Priority.MEDIUM;
            default:
                return Priority.LOW;
        }
    }
    
    /**
     * Create appropriate reminders based on email content
     */
    private void createReminders(Email email) {
        String content = email.getSubject() + " " + email.getContent();
        
        switch (email.getCategory()) {
            case INTERVIEW:
                createInterviewReminder(email, content);
                break;
            case ASSESSMENT:
                createAssessmentReminder(email, content);
                break;
            case FOLLOW_UP:
                createFollowUpReminder(email, content);
                break;
        }
    }
    
    /**
     * Extract date/time from email and create interview reminder
     */
    private void createInterviewReminder(Email email, String content) {
        LocalDateTime interviewDate = extractDateTime(content);
        
        if (interviewDate != null) {
            // Create reminder 2 hours before interview
            LocalDateTime reminderTime = interviewDate.minusHours(2);
            
            Reminder reminder = new Reminder(
                email,
                "Interview Reminder: " + email.getSender(),
                "You have an interview scheduled with " + email.getSender(),
                interviewDate,
                reminderTime,
                ReminderType.INTERVIEW_REMINDER
            );
            
            reminderRepository.save(reminder);
        }
    }
    
    /**
     * Create assessment deadline reminder
     */
    private void createAssessmentReminder(Email email, String content) {
        LocalDateTime deadline = extractDateTime(content);
        
        if (deadline != null) {
            // Create reminder 1 day before deadline
            LocalDateTime reminderTime = deadline.minusDays(1);
            
            Reminder reminder = new Reminder(
                email,
                "Assessment Due Soon",
                "Assessment from " + email.getSender() + " is due soon",
                deadline,
                reminderTime,
                ReminderType.ASSESSMENT_DEADLINE
            );
            
            reminderRepository.save(reminder);
        }
    }
    
    /**
     * Create follow-up reminder (typically 1 week after application)
     */
    private void createFollowUpReminder(Email email, String content) {
        // Create follow-up reminder for 1 week from now
        LocalDateTime followUpDate = email.getReceivedDate().plusWeeks(1);
        LocalDateTime reminderTime = followUpDate.minusHours(12);
        
        Reminder reminder = new Reminder(
            email,
            "Follow-up Time",
            "Consider following up on your application with " + email.getSender(),
            followUpDate,
            reminderTime,
            ReminderType.FOLLOW_UP_DUE
        );
        
        reminderRepository.save(reminder);
    }
    
    /**
     * Extract date/time from email content using regex patterns
     * This is a simplified version - in production, you'd use more sophisticated NLP
     */
    private LocalDateTime extractDateTime(String content) {
        // Common date patterns
        Pattern[] datePatterns = {
            Pattern.compile("(\\d{1,2})/(\\d{1,2})/(\\d{4})\\s+(\\d{1,2}):(\\d{2})\\s*(AM|PM)?", Pattern.CASE_INSENSITIVE),
            Pattern.compile("(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\\s+(\\d{1,2})/(\\d{1,2})\\s+(\\d{1,2}):(\\d{2})", Pattern.CASE_INSENSITIVE),
            Pattern.compile("(tomorrow|today)\\s+at\\s+(\\d{1,2}):(\\d{2})", Pattern.CASE_INSENSITIVE)
        };
        
        for (Pattern pattern : datePatterns) {
            Matcher matcher = pattern.matcher(content);
            if (matcher.find()) {
                try {
                    // This is a simplified parser - you'd want more robust date parsing
                    LocalDateTime now = LocalDateTime.now();
                    
                    if (matcher.group().toLowerCase().contains("tomorrow")) {
                        return now.plusDays(1).withHour(Integer.parseInt(matcher.group(2)))
                                .withMinute(Integer.parseInt(matcher.group(3)));
                    } else if (matcher.group().toLowerCase().contains("today")) {
                        return now.withHour(Integer.parseInt(matcher.group(2)))
                                .withMinute(Integer.parseInt(matcher.group(3)));
                    }
                    
                    // Add more parsing logic here for other patterns
                    
                } catch (Exception e) {
                    // Continue trying other patterns
                }
            }
        }
        
        return null; // No date found
    }
    
    /**
     * Get emails by category with pagination
     */
    public Page<Email> getEmailsByCategory(EmailCategory category, Pageable pageable) {
        return emailRepository.findByCategory(category, pageable);
    }
    
    /**
     * Get dashboard statistics
     */
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Email counts by category
        List<Object[]> categoryCounts = emailRepository.countEmailsByCategory();
        Map<String, Long> categoryStats = new HashMap<>();
        for (Object[] count : categoryCounts) {
            categoryStats.put(count[0].toString(), (Long) count[1]);
        }
        stats.put("emailsByCategory", categoryStats);
        
        // Pending reminders count
        List<Object[]> reminderCounts = reminderRepository.countPendingRemindersByType();
        Map<String, Long> reminderStats = new HashMap<>();
        for (Object[] count : reminderCounts) {
            reminderStats.put(count[0].toString(), (Long) count[1]);
        }
        stats.put("pendingReminders", reminderStats);
        
        // Recent emails (last 7 days)
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        List<Email> recentEmails = emailRepository.findRecentEmails(weekAgo);
        stats.put("recentEmailsCount", recentEmails.size());
        
        return stats;
    }
    
    /**
     * Mark email as read
     */
    public void markAsRead(Long emailId) {
        emailRepository.findById(emailId).ifPresent(email -> {
            email.setRead(true);
            emailRepository.save(email);
        });
    }
    
    /**
     * Search emails by keyword
     */
    public List<Email> searchEmails(String keyword) {
        return emailRepository.findByKeyword(keyword);
    }
    
    /**
     * Get all emails with pagination
     */
    public Page<Email> getAllEmails(Pageable pageable) {
        return emailRepository.findAll(pageable);
    }
    
    /**
     * Get email by ID
     */
    public Optional<Email> getEmailById(Long id) {
        return emailRepository.findById(id);
    }
    
    /**
     * Get emails by priority
     */
    public Page<Email> getEmailsByPriority(Priority priority, Pageable pageable) {
        return emailRepository.findByPriority(priority, pageable);
    }
    
    /**
     * Get emails by category and priority
     */
    public Page<Email> getEmailsByCategoryAndPriority(EmailCategory category, Priority priority, Pageable pageable) {
        return emailRepository.findByCategoryAndPriority(category, priority, pageable);
    }
    
    /**
     * Get emails by sender
     */
    public Page<Email> getEmailsBySender(String sender, Pageable pageable) {
        return emailRepository.findBySenderContainingIgnoreCase(sender, pageable);
    }
    // Add these methods to your existing EmailService class
/**
 * Fetch emails from Gmail and process them
 */
public void fetchEmailsFromGmail() {
    if (mailUsername.isEmpty() || mailPassword.isEmpty()) {
        System.out.println("Gmail credentials not configured, skipping email fetch");
        return;
    }
    
    System.out.println("Fetching emails from Gmail (last 7 days)...");
    
    try {
        Properties properties = new Properties();
        properties.put("mail.store.protocol", "imaps");
        properties.put("mail.imap.ssl.enable", "true");
        properties.put("mail.imap.ssl.trust", mailHost);
        properties.put("mail.imap.port", mailPort);
        
        Session session = Session.getInstance(properties);
        Store store = session.getStore("imaps");
        store.connect(mailHost, mailUsername, mailPassword);
        
        Folder inbox = store.getFolder("INBOX");
        inbox.open(Folder.READ_ONLY);

        // Calculate date for 7 days ago
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_MONTH, -7);
        Date weekAgo = cal.getTime();
        
        // Search for messages from the last week
        SearchTerm searchTerm = new ReceivedDateTerm(ComparisonTerm.GE, weekAgo);
        Message[] messages = inbox.search(searchTerm);
        
        // Sort messages by received date (newest first)
        Arrays.sort(messages, (m1, m2) -> {
            try {
                Date d1 = m1.getReceivedDate() != null ? m1.getReceivedDate() : m1.getSentDate();
                Date d2 = m2.getReceivedDate() != null ? m2.getReceivedDate() : m2.getSentDate();
                if (d1 == null && d2 == null) return 0;
                if (d1 == null) return 1;
                if (d2 == null) return -1;
                return d2.compareTo(d1); // Newest first
            } catch (MessagingException e) {
                return 0;
            }
        });
        System.out.println("Found " + messages.length + " messages from the last 7 days");

         int processedCount = 0;
        int duplicateCount = 0;
        
        
        
        for (Message message : messages) {
            try {
                boolean wasProcessed = processGmailMessage(message);
                if (wasProcessed) {
                    processedCount++;
                } else {
                    duplicateCount++;
                }
            } catch (Exception e) {
                System.err.println("Error processing message: " + e.getMessage());
            }
        }
        
        inbox.close(false);
        store.close();
        
           System.out.println("Gmail fetch completed. Processed: " + processedCount + 
                          ", Duplicates skipped: " + duplicateCount);
        
    } catch (Exception e) {
        System.err.println("Gmail fetch error: " + e.getMessage());
        e.printStackTrace();
    }
}

/**
 * Process individual Gmail message
 */
private boolean processGmailMessage(Message message) throws Exception {
    if (!(message instanceof MimeMessage)) return false;

    MimeMessage mimeMessage = (MimeMessage) message;
    String messageId = mimeMessage.getMessageID();
    
    if (messageId == null) return false;
     // Check if we already have this email
    Optional<Email> existingEmail = emailRepository.findByMessageId(messageId);
    if (existingEmail.isPresent()) {
        return false; // Already processed
    }
    
    String subject = mimeMessage.getSubject() != null ? mimeMessage.getSubject() : "No Subject";
    String sender = getSenderEmail(mimeMessage);
    String content = getEmailContent(mimeMessage);
    LocalDateTime receivedDate = getReceivedDate(mimeMessage);
    
    try {
        // Use existing processEmail method
        processEmail(messageId, subject, sender, mailUsername, content, receivedDate);
        System.out.println("Processed: " + subject + " from " + sender);
        return true;
    } catch (Exception e) {
         System.err.println("Error saving email: " + e.getMessage());
        return false;
    }
}

// Helper methods for Gmail processing
private String getSenderEmail(MimeMessage message) throws MessagingException {
    Address[] from = message.getFrom();
    return (from != null && from.length > 0) ? from[0].toString() : "Unknown";
}

private String getEmailContent(MimeMessage message) {
    try {
        if (message.isMimeType("text/plain")) {
            return (String) message.getContent();
        } else if (message.isMimeType("text/html")) {
            String html = (String) message.getContent();
            return html.replaceAll("<[^>]+>", ""); // Simple HTML strip
        }
        return "Content not available";
    } catch (Exception e) {
        return "Error reading content";
    }
}

private LocalDateTime getReceivedDate(MimeMessage message) throws MessagingException {
    Date date = message.getReceivedDate();
    if (date == null) date = message.getSentDate();
    if (date == null) date = new Date();
    
    return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
}
}