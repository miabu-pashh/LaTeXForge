package com.coldemail.service;

import com.coldemail.model.HRContact;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class HRService {
    
    public List<HRContact> generateHRContactsForCompany(String companyName) {
        List<HRContact> hrContacts = new ArrayList<>();
        
        // Common HR job titles and names for mock data
        String[] hrTitles = {"HR Manager", "Talent Acquisition", "Recruiter", "HR Director", "People Operations"};
        String[] firstNames = {"John", "Sarah", "Mike", "Lisa", "David", "Emma", "Chris", "Amy"};
        String[] lastNames = {"Smith", "Johnson", "Wilson", "Brown", "Davis", "Miller", "Moore", "Taylor"};
        
        // Generate 4-5 random HR contacts
        for (int i = 0; i < 4; i++) {
            String firstName = firstNames[i % firstNames.length];
            String lastName = lastNames[i % lastNames.length];
            String name = firstName + " " + lastName + " (" + hrTitles[i % hrTitles.length] + ")";
            
            // Generate email patterns
            String email = generateEmail(firstName, lastName, companyName);
            
            hrContacts.add(new HRContact(name, email, companyName));
        }
        
        return hrContacts;
    }
    
    private String generateEmail(String firstName, String lastName, String companyName) {
        // Generate email with common patterns
        String domain = companyName.toLowerCase().replaceAll("\\s+", "") + ".com";
        String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@" + domain;
        return email;
    }
    
    public List<String> generateEmailVariations(String firstName, String lastName, String companyName) {
        List<String> emailVariations = new ArrayList<>();
        String domain = companyName.toLowerCase().replaceAll("\\s+", "") + ".com";
        
        // Common email patterns
        emailVariations.add(firstName.toLowerCase() + "." + lastName.toLowerCase() + "@" + domain);
        emailVariations.add(firstName.toLowerCase() + lastName.toLowerCase() + "@" + domain);
        emailVariations.add(firstName.charAt(0) + "." + lastName.toLowerCase() + "@" + domain);
        emailVariations.add(firstName.toLowerCase() + "@" + domain);
        
        return emailVariations;
    }
}