package com.coldemail.controller;

import com.coldemail.model.HRContact;
import com.coldemail.service.HRService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/hr")
@CrossOrigin(origins = "http://localhost:3000")
public class HRController {
    
    @Autowired
    private HRService hrService;
    
    private List<HRContact> hrContacts = new ArrayList<>();
    
    @GetMapping("/search/{companyName}")
    public List<HRContact> searchHRByCompany(@PathVariable String companyName) {
        // Use service to generate HR contacts
        return hrService.generateHRContactsForCompany(companyName);
    }
    
    @PostMapping("/add")
    public HRContact addHRContact(@RequestBody HRContact hrContact) {
        hrContacts.add(hrContact);
        return hrContact;
    }
    
    @GetMapping("/all")
    public List<HRContact> getAllHRContacts() {
        return hrContacts;
    }
    
    @PostMapping("/select")
    public List<HRContact> selectHRContacts(@RequestBody List<HRContact> selectedContacts) {
        for (HRContact contact : selectedContacts) {
            contact.setSelected(true);
        }
        return selectedContacts;
    }
    
    @DeleteMapping("/clear")
    public String clearAllContacts() {
        hrContacts.clear();
        return "All HR contacts cleared successfully!";
    }
}