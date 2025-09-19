package com.emailmanager.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Email Entity - Represents a processed email in our system
 */
@Entity
@Table(name = "emails")
public class Email {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String messageId; // Original email message ID
    
    @Column(nullable = false)
    private String subject;
    
    @Column(nullable = false)
    private String sender;
    
    @Column(nullable = false)
    private String recipient;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Column(nullable = false)
    private LocalDateTime receivedDate;
    
    @Enumerated(EnumType.STRING)
    private EmailCategory category;
    
    @Enumerated(EnumType.STRING)
    private Priority priority;
    
    private boolean isRead = false;
    
    @OneToMany(mappedBy = "email", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Reminder> reminders = new ArrayList<>();
    
    // Constructors
    public Email() {}
    
    public Email(String messageId, String subject, String sender, String recipient, 
                 String content, LocalDateTime receivedDate) {
        this.messageId = messageId;
        this.subject = subject;
        this.sender = sender;
        this.recipient = recipient;
        this.content = content;
        this.receivedDate = receivedDate;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
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
    
    public LocalDateTime getReceivedDate() { return receivedDate; }
    public void setReceivedDate(LocalDateTime receivedDate) { this.receivedDate = receivedDate; }
    
    public EmailCategory getCategory() { return category; }
    public void setCategory(EmailCategory category) { this.category = category; }
    
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    
    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }
    
    public List<Reminder> getReminders() { return reminders; }
    public void setReminders(List<Reminder> reminders) { this.reminders = reminders; }
}