package com.emailmanager.model;

/**
 * Reminder status tracking
 */
public enum ReminderStatus {
    PENDING,    // Not yet triggered
    SENT,       // Reminder has been sent
    DISMISSED   // User dismissed the reminder
}