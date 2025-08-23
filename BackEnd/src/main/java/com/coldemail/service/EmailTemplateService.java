package com.coldemail.service;

import com.coldemail.model.EmailTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EmailTemplateService {
    
    // In-memory storage for templates (later we can add database)
    private List<EmailTemplate> templates = new ArrayList<>();
    
    public EmailTemplateService() {
        // Initialize with some default templates
        initializeDefaultTemplates();
    }
    
    private void initializeDefaultTemplates() {
        // Template 1: Software Engineer Position
        EmailTemplate softwareEngineerTemplate = new EmailTemplate(
            "software_engineer",
            "Application for Software Engineer Position - [CANDIDATE_NAME]",
            "Dear [RECIPIENT_NAME],\n\n" +
            "I hope this email finds you well. My name is [CANDIDATE_NAME], and I am writing to express my strong interest in the Software Engineer position at [COMPANY_NAME].\n\n" +
            "I am a recent graduate with a Master's degree in Software Engineering from Saint Louis University, with a GPA of 3.9. I have hands-on experience with:\n" +
            "• Java and Spring Boot development\n" +
            "• React and modern frontend technologies\n" +
            "• Database design and management\n" +
            "• Software development best practices\n\n" +
            "I am particularly drawn to [COMPANY_NAME] because of your innovative approach to technology and commitment to excellence. I would welcome the opportunity to discuss how my skills and enthusiasm can contribute to your team.\n\n" +
            "I have attached my resume for your review. I would be happy to provide any additional information or schedule a conversation at your convenience.\n\n" +
            "Thank you for your time and consideration.\n\n" +
            "Best regards,\n[CANDIDATE_NAME]\n[CANDIDATE_EMAIL]\n[CANDIDATE_PHONE]",
            "Professional software engineer job application template"
        );
        
        // Template 2: Internship Position
        EmailTemplate internshipTemplate = new EmailTemplate(
            "internship",
            "Internship Application - [CANDIDATE_NAME]",
            "Dear [RECIPIENT_NAME],\n\n" +
            "I hope you are doing well. I am [CANDIDATE_NAME], currently pursuing my Master's in Software Engineering at Saint Louis University.\n\n" +
            "I am writing to inquire about potential internship opportunities at [COMPANY_NAME] for the upcoming semester. I am eager to apply my academic knowledge in a real-world environment and contribute to your team.\n\n" +
            "My technical skills include:\n" +
            "• Programming languages: Java, JavaScript, Python\n" +
            "• Frameworks: Spring Boot, React\n" +
            "• Databases: MySQL, PostgreSQL\n" +
            "• Tools: Git, Maven, Docker\n\n" +
            "I am particularly interested in [COMPANY_NAME] because of your reputation for fostering innovation and providing excellent learning opportunities for students.\n\n" +
            "I would be grateful for the opportunity to discuss how I can contribute to your team while gaining valuable industry experience.\n\n" +
            "Thank you for considering my application.\n\n" +
            "Sincerely,\n[CANDIDATE_NAME]\n[CANDIDATE_EMAIL]\n[CANDIDATE_PHONE]",
            "Internship application template for students"
        );
        
        // Template 3: Entry Level Position
        EmailTemplate entryLevelTemplate = new EmailTemplate(
            "entry_level",
            "Entry-Level Developer Position - [CANDIDATE_NAME]",
            "Dear [RECIPIENT_NAME],\n\n" +
            "Good day! I am [CANDIDATE_NAME], and I am excited to apply for entry-level developer positions at [COMPANY_NAME].\n\n" +
            "As a recent graduate with a Master's degree in Software Engineering, I am eager to begin my career with a company known for its innovative solutions and collaborative work environment.\n\n" +
            "During my studies, I have developed proficiency in:\n" +
            "• Full-stack development (Java, React, Node.js)\n" +
            "• Database management and design\n" +
            "• Software testing and debugging\n" +
            "• Agile development methodologies\n\n" +
            "I am particularly excited about the opportunity to work at [COMPANY_NAME] because of your commitment to cutting-edge technology and professional development.\n\n" +
            "I would love to discuss how my fresh perspective and technical skills can benefit your development team.\n\n" +
            "Thank you for your time and consideration.\n\n" +
            "Best regards,\n[CANDIDATE_NAME]\n[CANDIDATE_EMAIL]\n[CANDIDATE_PHONE]",
            "General entry-level developer position template"
        );
        
        templates.add(softwareEngineerTemplate);
        templates.add(internshipTemplate);
        templates.add(entryLevelTemplate);
    }
    
    public List<EmailTemplate> getAllTemplates() {
        return new ArrayList<>(templates);
    }
    
    public EmailTemplate getTemplateByName(String templateName) {
        return templates.stream()
                .filter(template -> template.getTemplateName().equals(templateName))
                .findFirst()
                .orElse(null);
    }
    
    public EmailTemplate addTemplate(EmailTemplate template) {
        templates.add(template);
        return template;
    }
    
    public String personalizeTemplate(String templateBody, String candidateName, String candidateEmail, 
                                    String candidatePhone, String recipientName, String companyName) {
        return templateBody
                .replace("[CANDIDATE_NAME]", candidateName != null ? candidateName : "Your Name")
                .replace("[CANDIDATE_EMAIL]", candidateEmail != null ? candidateEmail : "your.email@example.com")
                .replace("[CANDIDATE_PHONE]", candidatePhone != null ? candidatePhone : "Your Phone")
                .replace("[RECIPIENT_NAME]", recipientName != null ? recipientName : "Hiring Manager")
                .replace("[COMPANY_NAME]", companyName != null ? companyName : "Your Company");
    }
}