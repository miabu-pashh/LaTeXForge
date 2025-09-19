package com.emailmanager.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.emailmanager.model.Email;
import com.emailmanager.model.EmailCategory;
import com.emailmanager.model.Priority;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Email Repository - Data access for email operations
 */
@Repository
public interface EmailRepository extends JpaRepository<Email, Long> {
    
    /**
     * Find email by original message ID to prevent duplicates
     */
    Optional<Email> findByMessageId(String messageId);
    
    /**
     * Find emails by category for dashboard filtering
     */
    Page<Email> findByCategory(EmailCategory category, Pageable pageable);
    
    /**
     * Find emails by priority level
     */
    Page<Email> findByPriority(Priority priority, Pageable pageable);
    
    /**
     * Find emails by category and priority (combined filtering)
     */
    Page<Email> findByCategoryAndPriority(EmailCategory category, Priority priority, Pageable pageable);
    
    /**
     * Find unread emails for notifications
     */
    List<Email> findByIsReadFalseOrderByReceivedDateDesc();
    
    /**
     * Find recent emails (last 7 days) for dashboard summary
     */
    @Query("SELECT e FROM Email e WHERE e.receivedDate >= :dateFrom ORDER BY e.receivedDate DESC")
    List<Email> findRecentEmails(@Param("dateFrom") LocalDateTime dateFrom);
    
    /**
     * Count emails by category for dashboard statistics
     */
    @Query("SELECT e.category, COUNT(e) FROM Email e GROUP BY e.category")
    List<Object[]> countEmailsByCategory();
    
    /**
     * Find emails containing specific keywords in subject or content
     * Used for better categorization and search
     */
    @Query("SELECT e FROM Email e WHERE LOWER(e.subject) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(e.content) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "ORDER BY e.receivedDate DESC")
    List<Email> findByKeyword(@Param("keyword") String keyword);
    
    /**
     * Find emails from specific sender
     */
    Page<Email> findBySenderContainingIgnoreCase(String sender, Pageable pageable);
}
