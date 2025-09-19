package com.emailmanager.controller;

import com.emailmanager.model.Reminder;
import com.emailmanager.model.ReminderStatus;
import com.emailmanager.model.ReminderType;
import com.emailmanager.service.ReminderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Reminder Controller - REST API endpoints for reminder operations
 */
@RestController
@RequestMapping("/api/reminders")
@CrossOrigin(origins = "http://localhost:3000")
public class ReminderController {
    
    @Autowired
    private ReminderService reminderService;
    
    /**
     * Get all pending reminders
     * GET /api/reminders/pending
     */
    @GetMapping("/pending")
    public ResponseEntity<List<Reminder>> getPendingReminders() {
        List<Reminder> reminders = reminderService.getPendingReminders();
        return ResponseEntity.ok(reminders);
    }
    
    /**
     * Get upcoming reminders (next 7 days)
     * GET /api/reminders/upcoming
     */
    @GetMapping("/upcoming")
    public ResponseEntity<List<Reminder>> getUpcomingReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime nextWeek = now.plusDays(7);
        List<Reminder> reminders = reminderService.getUpcomingReminders(now, nextWeek);
        return ResponseEntity.ok(reminders);
    }
    
    /**
     * Get reminders by type
     * GET /api/reminders/by-type?type=INTERVIEW_REMINDER
     */
    @GetMapping("/by-type")
    public ResponseEntity<List<Reminder>> getRemindersByType(@RequestParam ReminderType type) {
        List<Reminder> reminders = reminderService.getRemindersByType(type);
        return ResponseEntity.ok(reminders);
    }
    
    /**
     * Get reminders for specific email
     * GET /api/reminders/email/1
     */
    @GetMapping("/email/{emailId}")
    public ResponseEntity<List<Reminder>> getRemindersForEmail(@PathVariable Long emailId) {
        List<Reminder> reminders = reminderService.getRemindersForEmail(emailId);
        return ResponseEntity.ok(reminders);
    }
    
    /**
     * Dismiss a reminder
     * PUT /api/reminders/1/dismiss
     */
    @PutMapping("/{id}/dismiss")
    public ResponseEntity<Void> dismissReminder(@PathVariable Long id) {
        reminderService.dismissReminder(id);
        return ResponseEntity.ok().build();
    }
    
    /**
     * Snooze a reminder (delay by specified hours)
     * PUT /api/reminders/1/snooze?hours=2
     */
    @PutMapping("/{id}/snooze")
    public ResponseEntity<Void> snoozeReminder(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") int hours) {
        reminderService.snoozeReminder(id, hours);
        return ResponseEntity.ok().build();
    }
    
    /**
     * Get reminder statistics
     * GET /api/reminders/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getReminderStats() {
        Map<String, Object> stats = reminderService.getReminderStats();
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Manually create a reminder
     * POST /api/reminders
     */
    @PostMapping
    public ResponseEntity<Reminder> createReminder(@RequestBody CreateReminderRequest request) {
        Reminder reminder = reminderService.createReminder(
            request.getEmailId(),
            request.getTitle(),
            request.getDescription(),
            request.getEventDateTime(),
            request.getReminderDateTime(),
            request.getType()
        );
        return ResponseEntity.ok(reminder);
    }
    
    /**
     * Get reminder types (for frontend dropdowns)
     * GET /api/reminders/types
     */
    @GetMapping("/types")
    public ResponseEntity<ReminderType[]> getReminderTypes() {
        return ResponseEntity.ok(ReminderType.values());
    }
    
    /**
     * Get reminder statuses (for frontend dropdowns)
     * GET /api/reminders/statuses
     */
    @GetMapping("/statuses")
    public ResponseEntity<ReminderStatus[]> getReminderStatuses() {
        return ResponseEntity.ok(ReminderStatus.values());
    }
    
    /**
     * Get overdue reminders
     * GET /api/reminders/overdue
     */
    @GetMapping("/overdue")
    public ResponseEntity<List<Reminder>> getOverdueReminders() {
        List<Reminder> reminders = reminderService.getOverdueReminders();
        return ResponseEntity.ok(reminders);
    }
}

/**
 * DTO for creating reminders manually
 */
class CreateReminderRequest {
    private Long emailId;
    private String title;
    private String description;
    private LocalDateTime eventDateTime;
    private LocalDateTime reminderDateTime;
    private ReminderType type;
    
    // Constructors
    public CreateReminderRequest() {}
    
    // Getters and Setters
    public Long getEmailId() { return emailId; }
    public void setEmailId(Long emailId) { this.emailId = emailId; }
    
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
}