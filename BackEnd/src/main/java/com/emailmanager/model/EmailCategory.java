package com.emailmanager.model;

public enum EmailCategory {
    INTERVIEW,          // Interview invitations and related communication
    ASSESSMENT,         // Coding tests, assignments, evaluations
    JOB_APPLICATION,    // Application confirmations, updates
    FOLLOW_UP,          // Follow-up reminders and requests
    REJECTION,          // Unfortunately, these happen too
    OFFER,              // The good news!
    GENERAL,            // Everything else
    SPAM                // Filtered out content
}
