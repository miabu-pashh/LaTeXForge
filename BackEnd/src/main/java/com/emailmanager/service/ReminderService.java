package com.emailmanager.service;

import com.emailmanager.model.*;
import com.emailmanager.repository.EmailRepository;
import com.emailmanager.repository.ReminderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Reminder Service - Business logic for reminder operations and notifications
 */
@Service
@Transactional
public class ReminderService {
    
    @Autowired
    private ReminderRepository reminderRepository;
    
    @Autowired
    private EmailRepository emailRepository;
    
    /**
     * Get all pending reminders
     */
    public List<Reminder> getPendingReminders() {
        return reminderRepository.findPendingReminders(
            ReminderStatus.PENDING, 
            LocalDateTime.now()
        );
    }
    
    /**
     * Get upcoming reminders in a date range
     */
    public List<Reminder> getUpcomingReminders(LocalDateTime start, LocalDateTime end) {
        return reminderRepository.findUpcomingReminders(start, end);
    }
    
    /**
     * Get reminders by type
     */
    public List<Reminder> getRemindersByType(ReminderType type) {
        return reminderRepository.findByTypeOrderByEventDateTimeAsc(type);
    }
    
    /**
     * Get reminders for specific email
     */
    public List<Reminder> getRemindersForEmail(Long emailId) {
        return reminderRepository.findByEmailIdOrderByReminderDateTimeAsc(emailId);
    }
    
    /**
     * Dismiss a reminder
     */
    public void dismissReminder(Long reminderId) {
        reminderRepository.findById(reminderId).ifPresent(reminder -> {
            reminder.setStatus(ReminderStatus.DISMISSED);
            reminderRepository.save(reminder);
        });
    }
    
    /**
     * Snooze a reminder by specified hours
     */
    public void snoozeReminder(Long reminderId, int hours) {
        reminderRepository.findById(reminderId).ifPresent(reminder -> {
            LocalDateTime newReminderTime = reminder.getReminderDateTime().plusHours(hours);
            reminder.setReminderDateTime(newReminderTime);
            reminder.setStatus(ReminderStatus.PENDING);
            reminderRepository.save(reminder);
        });
    }
    
    /**
     * Create a manual reminder
     */
    public Reminder createReminder(Long emailId, String title, String description,
                                 LocalDateTime eventDateTime, LocalDateTime reminderDateTime,
                                 ReminderType type) {
        
        Optional<Email> emailOpt = emailRepository.findById(emailId);
        if (emailOpt.isEmpty()) {
            throw new RuntimeException("Email not found with ID: " + emailId);
        }
        
        Reminder reminder = new Reminder(
            emailOpt.get(),
            title,
            description,
            eventDateTime,
            reminderDateTime,
            type
        );
        
        return reminderRepository.save(reminder);
    }
    
    /**
     * Get reminder statistics for dashboard
     */
    public Map<String, Object> getReminderStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Pending reminders by type
        List<Object[]> reminderCounts = reminderRepository.countPendingRemindersByType();
        Map<String, Long> reminderStats = new HashMap<>();
        for (Object[] count : reminderCounts) {
            reminderStats.put(count[0].toString(), (Long) count[1]);
        }
        stats.put("pendingByType", reminderStats);
        
        // Upcoming reminders (next 7 days)
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime nextWeek = now.plusDays(7);
        List<Reminder> upcomingReminders = getUpcomingReminders(now, nextWeek);
        stats.put("upcomingCount", upcomingReminders.size());
        
        // Overdue reminders
        List<Reminder> overdueReminders = getOverdueReminders();
        stats.put("overdueCount", overdueReminders.size());
        
        return stats;
    }
    
    /**
     * Get overdue reminders (reminders that should have been triggered)
     */
    public List<Reminder> getOverdueReminders() {
        return reminderRepository.findPendingReminders(
            ReminderStatus.PENDING,
            LocalDateTime.now().minusDays(1) // Consider reminders from yesterday as overdue
        );
    }
    
    /**
     * Scheduled task to check and trigger reminders
     * Runs every 5 minutes
     */
    @Scheduled(fixedRate = 300000) // 5 minutes = 300,000 milliseconds
    public void checkAndTriggerReminders() {
        System.out.println("Checking for pending reminders...");
        
        List<Reminder> pendingReminders = getPendingReminders();
        
        for (Reminder reminder : pendingReminders) {
            if (shouldTriggerReminder(reminder)) {
                triggerReminder(reminder);
            }
        }
        
        if (!pendingReminders.isEmpty()) {
            System.out.println("Processed " + pendingReminders.size() + " pending reminders");
        }
    }
    
    /**
     * Check if a reminder should be triggered
     */
    private boolean shouldTriggerReminder(Reminder reminder) {
        LocalDateTime now = LocalDateTime.now();
        return reminder.getStatus() == ReminderStatus.PENDING 
            && reminder.getReminderDateTime().isBefore(now.plusMinutes(5)); // 5-minute buffer
    }
    
    /**
     * Trigger a reminder (send notification)
     */
    private void triggerReminder(Reminder reminder) {
        try {
            // In a real application, you would send:
            // - Email notifications
            // - Push notifications
            // - SMS notifications
            // - In-app notifications
            
            // For now, we'll just log and mark as sent
            System.out.println("REMINDER TRIGGERED: " + reminder.getTitle());
            System.out.println("Event: " + reminder.getEventDateTime());
            System.out.println("Description: " + reminder.getDescription());
            System.out.println("Type: " + reminder.getType());
            System.out.println("Email Subject: " + reminder.getEmail().getSubject());
            System.out.println("---");
            
            // Mark as sent
            reminder.setStatus(ReminderStatus.SENT);
            reminderRepository.save(reminder);
            
        } catch (Exception e) {
            System.err.println("Error triggering reminder: " + e.getMessage());
        }
    }
    
    /**
     * Send notification (placeholder for future implementation)
     */
    private void sendNotification(Reminder reminder) {
        // TODO: Implement actual notification sending
        // This could include:
        // - Email via SMTP
        // - Push notifications via Firebase
        // - SMS via Twilio
        // - Slack/Discord webhooks
        // - Browser notifications via WebSocket
    }
}