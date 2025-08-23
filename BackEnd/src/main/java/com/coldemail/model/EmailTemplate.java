package com.coldemail.model;

public class EmailTemplate {
    private String templateName;
    private String subject;
    private String body;
    private String description;
    
    // Default constructor
    public EmailTemplate() {
    }
    
    // Constructor
    public EmailTemplate(String templateName, String subject, String body, String description) {
        this.templateName = templateName;
        this.subject = subject;
        this.body = body;
        this.description = description;
    }
    
    // Getters and Setters
    public String getTemplateName() {
        return templateName;
    }
    
    public void setTemplateName(String templateName) {
        this.templateName = templateName;
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
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    @Override
    public String toString() {
        return "EmailTemplate{" +
                "templateName='" + templateName + '\'' +
                ", subject='" + subject + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}