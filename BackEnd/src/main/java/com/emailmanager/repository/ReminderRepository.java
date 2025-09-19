package com.emailmanager.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.emailmanager.model.Reminder;
import com.emailmanager.model.ReminderStatus;
import com.emailmanager.model.ReminderType;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Reminder Repository - Data access for reminder operations
 */
@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    
    /**
     * Find pending reminders that should be triggered now
     */
    @Query("SELECT r FROM Reminder r WHERE r.status = :status " +
           "AND r.reminderDateTime <= :currentTime " +
           "ORDER BY r.reminderDateTime ASC")
    List<Reminder> findPendingReminders(@Param("status") ReminderStatus status, 
                                       @Param("currentTime") LocalDateTime currentTime);
    
    /**
     * Find reminders by type for filtering
     */
    List<Reminder> findByTypeOrderByEventDateTimeAsc(ReminderType type);
    
    /**
     * Find upcoming reminders (next 7 days) for dashboard
     */
    @Query("SELECT r FROM Reminder r WHERE r.status = 'PENDING' " +
           "AND r.eventDateTime BETWEEN :startDate AND :endDate " +
           "ORDER BY r.eventDateTime ASC")
    List<Reminder> findUpcomingReminders(@Param("startDate") LocalDateTime startDate,
                                        @Param("endDate") LocalDateTime endDate);
    
    /**
     * Find reminders for specific email
     */
    List<Reminder> findByEmailIdOrderByReminderDateTimeAsc(Long emailId);
    
    /**
     * Count pending reminders by type for dashboard stats
     */
    @Query("SELECT r.type, COUNT(r) FROM Reminder r WHERE r.status = 'PENDING' GROUP BY r.type")
    List<Object[]> countPendingRemindersByType();
}