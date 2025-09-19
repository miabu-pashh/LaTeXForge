package com.resumegenerator.model;

public class WhyIFitRequest {
    private String jobDescription;
    private String companyName;
    private String candidateName;
    private String candidateEmail;
    
    // Default constructor
    public WhyIFitRequest() {
    }
    
    // Constructor with parameters
    public WhyIFitRequest(String jobDescription, String companyName, String candidateName, String candidateEmail) {
        this.jobDescription = jobDescription;
        this.companyName = companyName;
        this.candidateName = candidateName;
        this.candidateEmail = candidateEmail;
    }
    
    // Getters and Setters
    public String getJobDescription() {
        return jobDescription;
    }
    
    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }
    
    public String getCompanyName() {
        return companyName;
    }
    
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
    
    public String getCandidateName() {
        return candidateName;
    }
    
    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }
    
    public String getCandidateEmail() {
        return candidateEmail;
    }
    
    public void setCandidateEmail(String candidateEmail) {
        this.candidateEmail = candidateEmail;
    }
    
    @Override
    public String toString() {
        return "WhyIFitRequest{" +
                "jobDescription='" + jobDescription + '\'' +
                ", companyName='" + companyName + '\'' +
                ", candidateName='" + candidateName + '\'' +
                ", candidateEmail='" + candidateEmail + '\'' +
                '}';
    }
}