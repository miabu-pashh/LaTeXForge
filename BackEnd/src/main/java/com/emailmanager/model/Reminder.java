package com.emailmanager.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Reminder Entity - Automated reminders for important events
 */
@Entity
@Table(name = "reminders")
public class Reminder {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "email_id", nullable = false)
    private Email email;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private LocalDateTime eventDateTime;
    
    @Column(nullable = false)
    private LocalDateTime reminderDateTime;
    
    @Enumerated(EnumType.STRING)
    private ReminderType type;
    
    @Enumerated(EnumType.STRING)
    private ReminderStatus status = ReminderStatus.PENDING;
    
    // Constructors
    public Reminder() {}
    
    public Reminder(Email email, String title, String description, 
                   LocalDateTime eventDateTime, LocalDateTime reminderDateTime, 
                   ReminderType type) {
        this.email = email;
        this.title = title;
        this.description = description;
        this.eventDateTime = eventDateTime;
        this.reminderDateTime = reminderDateTime;
        this.type = type;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Email getEmail() { return email; }
    public void setEmail(Email email) { this.email = email; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDateTime getEventDateTime() { return eventDateTime; }
    public void setEventDateTime(LocalDateTime eventDateTime) { this.eventDateTime = eventDateTime; }
    
    public LocalDateTime getReminderDateTime() { return reminderDateTime; }
    public void setReminderDateTime(LocalDateTime reminderDateTime) { this.reminderDateTime = reminderDateTime; }
    
    public ReminderType getType() { return type; }
    public void setType(ReminderType type) { this.type = type; }
    
    public ReminderStatus getStatus() { return status; }
    public void setStatus(ReminderStatus status) { this.status = status; }
}