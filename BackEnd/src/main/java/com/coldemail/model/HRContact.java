package com.coldemail.model;

public class HRContact {
    private String name;
    private String email;
    private String company;
    private boolean selected;
    
    // Default constructor
    public HRContact() {
    }
    
    // Constructor with parameters
    public HRContact(String name, String email, String company) {
        this.name = name;
        this.email = email;
        this.company = company;
        this.selected = false; // Default not selected
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getCompany() {
        return company;
    }
    
    public void setCompany(String company) {
        this.company = company;
    }
    
    public boolean isSelected() {
        return selected;
    }
    
    public void setSelected(boolean selected) {
        this.selected = selected;
    }
    
    @Override
    public String toString() {
        return "HRContact{" +
                "name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", company='" + company + '\'' +
                ", selected=" + selected +
                '}';
    }
}