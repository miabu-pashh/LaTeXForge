package com.resumegenerator.service;

import com.resumegenerator.model.WhyIFitRequest;
import com.resumegenerator.model.WhyIFitResponse;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service  // This annotation tells Spring this is a service component
public class WhyIFitService {
    
    // This method processes the Gemini AI output and converts it to LaTeX format
    public WhyIFitResponse generateWhyIFitDocument(WhyIFitRequest request, String geminiOutput) {
        try {
            // Step 1: Load the LaTeX template from file
            String template = loadTemplateFromFile();
            
            // Step 2: Parse the Gemini output to extract requirements and summary
            String tableContent = parseRequirementsFromGemini(geminiOutput);
            String summaryContent = parseSummaryFromGemini(geminiOutput);
            
            // Step 3: Get today's date in a nice format
            String todayDate = getCurrentDate();
            
            // Step 4: Replace placeholders in the template
            String finalLatex = template
                .replace("[[TARGET_COMPANY]]", request.getCompanyName())
                .replace("[[TODAY_DATE]]", todayDate)
                .replace("[[REQUIREMENTS_TABLE_CONTENT]]", tableContent)
                .replace("[[SUMMARY_CONTENT]]", summaryContent);
            
            // Step 5: Create and return the response object
            WhyIFitResponse response = new WhyIFitResponse();
            response.setTargetCompany(request.getCompanyName());
            response.setTodayDate(todayDate);
            response.setRequirementsTableContent(tableContent);
            response.setSummaryContent(summaryContent);
            response.setFinalLatexContent(finalLatex);
            
            System.out.println("✅ Successfully generated Why I Fit document for: " + request.getCompanyName());
            return response;
            
        } catch (Exception e) {
            System.err.println("❌ Error generating Why I Fit document: " + e.getMessage());
            throw new RuntimeException("Failed to generate Why I Fit document", e);
        }
    }
    
    // This method loads the LaTeX template from the resources folder
    private String loadTemplateFromFile() throws IOException {
        try {
            // ClassPathResource helps us read files from src/main/resources
            ClassPathResource resource = new ClassPathResource("templates/why-i-fit-template.tex");
            // Convert the file content to a String
            return Files.readString(resource.getFile().toPath());
        } catch (IOException e) {
            System.err.println("❌ Could not load template file: " + e.getMessage());
            throw new IOException("Template file not found", e);
        }
    }
    
    // This method extracts the requirements table from Gemini's output
    private String parseRequirementsFromGemini(String geminiOutput) {
        StringBuilder tableRows = new StringBuilder();
        
        try {
            // Look for the SECTION 1: MATCHED REQUIREMENTS part
            Pattern sectionPattern = Pattern.compile("🔹 SECTION 1: MATCHED REQUIREMENTS\\s*\\n(.*?)(?=🔹 SECTION 2|---)", Pattern.DOTALL);
            Matcher sectionMatcher = sectionPattern.matcher(geminiOutput);
            
            if (sectionMatcher.find()) {
                String requirementsSection = sectionMatcher.group(1);
                
                // Parse individual requirement blocks
                Pattern requirementPattern = Pattern.compile("\\*\\*Requirement:\\*\\*\\s*(.*?)\\n\\*\\*Experience:\\*\\*\\s*(.*?)(?=\\n\\*\\*Requirement:|$)", Pattern.DOTALL);
                Matcher requirementMatcher = requirementPattern.matcher(requirementsSection);
                
                while (requirementMatcher.find()) {
                    String requirement = requirementMatcher.group(1).trim();
                    String experience = requirementMatcher.group(2).trim();
                    
                    // Clean up the text for LaTeX (escape special characters if needed)
                    requirement = cleanTextForLatex(requirement);
                    experience = cleanTextForLatex(experience);
                    
                    // Add LaTeX table row format: requirement & experience \\
                    tableRows.append(requirement)
                             .append(" & ")
                             .append(experience)
                             .append(" \\\\\n");
                }
            }
            
            System.out.println("✅ Parsed " + countTableRows(tableRows.toString()) + " requirements from Gemini output");
            
        } catch (Exception e) {
            System.err.println("❌ Error parsing requirements: " + e.getMessage());
            // Fallback content if parsing fails
            tableRows.append("Job Analysis & Experience analysis will be populated here \\\\\n");
        }
        
        return tableRows.toString();
    }
    
    // This method extracts the summary paragraph from Gemini's output
    private String parseSummaryFromGemini(String geminiOutput) {
        try {
            // Look for SECTION 2: SUMMARY PARAGRAPH
            Pattern summaryPattern = Pattern.compile("🔹 SECTION 2: SUMMARY PARAGRAPH\\s*\\n(.*?)(?=\\n\\n|$)", Pattern.DOTALL);
            Matcher summaryMatcher = summaryPattern.matcher(geminiOutput);
            
            if (summaryMatcher.find()) {
                String summary = summaryMatcher.group(1).trim();
                return cleanTextForLatex(summary);
            }
            
        } catch (Exception e) {
            System.err.println("❌ Error parsing summary: " + e.getMessage());
        }
        
        // Fallback content if parsing fails
        return "Summary content will be populated based on job requirements analysis.";
    }
    
    // This method cleans text to be safe for LaTeX (removes problematic characters)
    private String cleanTextForLatex(String text) {
        if (text == null) return "";
        
        return text
            .replace("&", "\\&")      // Escape ampersand
            .replace("%", "\\%")      // Escape percent
            .replace("$", "\\$")      // Escape dollar sign
            .replace("#", "\\#")      // Escape hash
            .replace("_", "\\_")      // Escape underscore
            .replace("{", "\\{")      // Escape left brace
            .replace("}", "\\}")      // Escape right brace
            .replaceAll("\\s+", " ")  // Replace multiple spaces with single space
            .trim();                  // Remove leading/trailing spaces
    }
    
    // Helper method to count table rows for logging
    private int countTableRows(String tableContent) {
        return (int) tableContent.lines().count();
    }
    
    // Get current date in a nice format
    private String getCurrentDate() {
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM d, yyyy");
        return today.format(formatter);
    }
    
}