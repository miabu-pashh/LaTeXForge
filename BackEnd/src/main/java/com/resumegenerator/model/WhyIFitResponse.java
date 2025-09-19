package com.resumegenerator.model;

public class WhyIFitResponse {
    private String requirementsTableContent;
    private String summaryContent;
    private String targetCompany;
    private String todayDate;
    private String finalLatexContent;
    
    // Default constructor
    public WhyIFitResponse() {
    }
    
    // Constructor
    public WhyIFitResponse(String requirementsTableContent, String summaryContent, 
                          String targetCompany, String todayDate, String finalLatexContent) {
        this.requirementsTableContent = requirementsTableContent;
        this.summaryContent = summaryContent;
        this.targetCompany = targetCompany;
        this.todayDate = todayDate;
        this.finalLatexContent = finalLatexContent;
    }
    
    // Getters and Setters
    public String getRequirementsTableContent() {
        return requirementsTableContent;
    }
    
    public void setRequirementsTableContent(String requirementsTableContent) {
        this.requirementsTableContent = requirementsTableContent;
    }
    
    public String getSummaryContent() {
        return summaryContent;
    }
    
    public void setSummaryContent(String summaryContent) {
        this.summaryContent = summaryContent;
    }
    
    public String getTargetCompany() {
        return targetCompany;
    }
    
    public void setTargetCompany(String targetCompany) {
        this.targetCompany = targetCompany;
    }
    
    public String getTodayDate() {
        return todayDate;
    }
    
    public void setTodayDate(String todayDate) {
        this.todayDate = todayDate;
    }
    
    public String getFinalLatexContent() {
        return finalLatexContent;
    }
    
    public void setFinalLatexContent(String finalLatexContent) {
        this.finalLatexContent = finalLatexContent;
    }
    
    @Override
    public String toString() {
        return "WhyIFitResponse{" +
                "targetCompany='" + targetCompany + '\'' +
                ", todayDate='" + todayDate + '\'' +
                ", requirementsTableLength=" + (requirementsTableContent != null ? requirementsTableContent.length() : 0) +
                ", summaryContentLength=" + (summaryContent != null ? summaryContent.length() : 0) +
                '}';
    }
}