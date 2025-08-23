package com.coldemail.controller;

import com.coldemail.model.EmailTemplate;
import com.coldemail.service.EmailTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/templates")
@CrossOrigin(origins = "http://localhost:3000")
public class EmailTemplateController {
    
    @Autowired
    private EmailTemplateService emailTemplateService;
    
    @GetMapping("/all")
    public List<EmailTemplate> getAllTemplates() {
        return emailTemplateService.getAllTemplates();
    }
    
    @GetMapping("/{templateName}")
    public EmailTemplate getTemplate(@PathVariable String templateName) {
        return emailTemplateService.getTemplateByName(templateName);
    }
    
    @PostMapping("/add")
    public EmailTemplate addTemplate(@RequestBody EmailTemplate template) {
        return emailTemplateService.addTemplate(template);
    }
    
    @PostMapping("/personalize")
    public Map<String, String> personalizeTemplate(@RequestBody Map<String, String> request) {
        String templateName = request.get("templateName");
        String candidateName = request.get("candidateName");
        String candidateEmail = request.get("candidateEmail");
        String candidatePhone = request.get("candidatePhone");
        String recipientName = request.get("recipientName");
        String companyName = request.get("companyName");
        
        EmailTemplate template = emailTemplateService.getTemplateByName(templateName);
        
        if (template == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Template not found");
            return error;
        }
        
        String personalizedBody = emailTemplateService.personalizeTemplate(
            template.getBody(), 
            candidateName, 
            candidateEmail, 
            candidatePhone, 
            recipientName, 
            companyName
        );
        
        String personalizedSubject = emailTemplateService.personalizeTemplate(
            template.getSubject(), 
            candidateName, 
            candidateEmail, 
            candidatePhone, 
            recipientName, 
            companyName
        );
        
        Map<String, String> result = new HashMap<>();
        result.put("subject", personalizedSubject);
        result.put("body", personalizedBody);
        result.put("templateName", template.getTemplateName());
        
        return result;
    }
}