package com.coldemail.model;

import java.util.List;

public class EmailRequest {
    private List<String> recipients;
    private String subject;
    private String body;
    private String senderName;
    
    // Default constructor
    public EmailRequest() {
    }
    
    // Constructor with parameters
    public EmailRequest(List<String> recipients, String subject, String body, String senderName) {
        this.recipients = recipients;
        this.subject = subject;
        this.body = body;
        this.senderName = senderName;
    }
    
    // Getters and Setters
    public List<String> getRecipients() {
        return recipients;
    }
    
    public void setRecipients(List<String> recipients) {
        this.recipients = recipients;
    }
    
    public String getSubject() {
        return subject;
    }
    
    public void setSubject(String subject) {
        this.subject = subject;
    }
    
    public String getBody() {
        return body;
    }
    
    public void setBody(String body) {
        this.body = body;
    }
    
    public String getSenderName() {
        return senderName;
    }
    
    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }
    
    @Override
    public String toString() {
        return "EmailRequest{" +
                "recipients=" + recipients +
                ", subject='" + subject + '\'' +
                ", body='" + body + '\'' +
                ", senderName='" + senderName + '\'' +
                '}';
    }
}