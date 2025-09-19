package com.resumegenerator.controller;

import com.resumegenerator.model.WhyIFitRequest;
import com.resumegenerator.model.WhyIFitResponse;
import com.resumegenerator.service.WhyIFitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController  // This tells Spring this class handles HTTP requests and returns JSON
@RequestMapping("/api/why-i-fit")  // All endpoints in this class start with /api/why-i-fit
@CrossOrigin(origins = "http://localhost:3000")  // Allow requests from React app
public class WhyIFitController {
    
    // @Autowired tells Spring to automatically inject the WhyIFitService
    // This is called "Dependency Injection" - Spring manages object creation for us
    @Autowired
    private WhyIFitService whyIFitService;
    
    // Test endpoint to check if the controller is working
    @GetMapping("/test")  // Handles GET requests to /api/why-i-fit/test
    public ResponseEntity<Map<String, String>> testEndpoint() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Why I Fit controller is working!");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        
        // ResponseEntity lets us control the HTTP status code and headers
        return ResponseEntity.ok(response);  // Returns HTTP 200 OK
    }
    
    // Main endpoint to generate the Why I Fit document
    @PostMapping("/generate")  // Handles POST requests to /api/why-i-fit/generate
    public ResponseEntity<Map<String, Object>> generateDocument(@RequestBody Map<String, Object> requestData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Extract data from the request JSON
            String jobDescription = (String) requestData.get("jobDescription");
            String companyName = (String) requestData.get("companyName");
            String candidateName = (String) requestData.get("candidateName");
            String candidateEmail = (String) requestData.get("candidateEmail");
            String geminiOutput = (String) requestData.get("geminiOutput");  // AI-generated content
            
            // Validation: Check if required fields are provided
            if (jobDescription == null || jobDescription.trim().isEmpty()) {
                response.put("status", "error");
                response.put("message", "Job description is required");
                return ResponseEntity.badRequest().body(response);  // HTTP 400 Bad Request
            }
            
            if (geminiOutput == null || geminiOutput.trim().isEmpty()) {
                response.put("status", "error");
                response.put("message", "Gemini AI output is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Create request object for the service
            WhyIFitRequest request = new WhyIFitRequest();
            request.setJobDescription(jobDescription);
            request.setCompanyName(companyName != null ? companyName : "Target Company");
            request.setCandidateName(candidateName != null ? candidateName : "Mahaboob Pasha Mohammad");
            request.setCandidateEmail(candidateEmail != null ? candidateEmail : "mahaboobpashamohammad8@gmail.com");
            
            // Log the incoming request for debugging
            System.out.println("📄 Generating Why I Fit document for: " + request.getCompanyName());
            System.out.println("📝 Job description length: " + jobDescription.length() + " characters");
            System.out.println("🤖 Gemini output length: " + geminiOutput.length() + " characters");
            
            // Call the service to process the request
            WhyIFitResponse serviceResponse = whyIFitService.generateWhyIFitDocument(request, geminiOutput);
            
            // Build successful response
            response.put("status", "success");
            response.put("message", "Why I Fit document generated successfully");
            response.put("data", Map.of(
                "targetCompany", serviceResponse.getTargetCompany(),
                "todayDate", serviceResponse.getTodayDate(),
                "requirementsTableContent", serviceResponse.getRequirementsTableContent(),
                "summaryContent", serviceResponse.getSummaryContent(),
                "finalLatexContent", serviceResponse.getFinalLatexContent()
            ));
            
            System.out.println("✅ Successfully generated document for " + serviceResponse.getTargetCompany());
            return ResponseEntity.ok(response);  // HTTP 200 OK
            
        } catch (Exception e) {
            // Handle any errors that occur during processing
            System.err.println("❌ Error in WhyIFitController: " + e.getMessage());
            e.printStackTrace();  // Print full error details for debugging
            
            response.put("status", "error");
            response.put("message", "Failed to generate document: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);  // HTTP 500 Internal Server Error
        }
    }
    
    // Endpoint to get just the parsed requirements (for preview)
    @PostMapping("/preview")  // Handles POST requests to /api/why-i-fit/preview
    public ResponseEntity<Map<String, Object>> previewContent(@RequestBody Map<String, Object> requestData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String geminiOutput = (String) requestData.get("geminiOutput");
            String companyName = (String) requestData.get("companyName");
            
            if (geminiOutput == null || geminiOutput.trim().isEmpty()) {
                response.put("status", "error");
                response.put("message", "Gemini output is required for preview");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Create a dummy request for preview
            WhyIFitRequest request = new WhyIFitRequest();
            request.setCompanyName(companyName != null ? companyName : "Sample Company");
            
            // Generate preview content
            WhyIFitResponse serviceResponse = whyIFitService.generateWhyIFitDocument(request, geminiOutput);
            
            response.put("status", "success");
            response.put("message", "Preview generated successfully");
            response.put("preview", Map.of(
                "requirementsCount", serviceResponse.getRequirementsTableContent().split("\\\\\\\\").length - 1,
                "summaryLength", serviceResponse.getSummaryContent().length(),
                "summaryPreview", serviceResponse.getSummaryContent().substring(0, 
                    Math.min(150, serviceResponse.getSummaryContent().length())) + "..."
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error generating preview: " + e.getMessage());
            response.put("status", "error");
            response.put("message", "Failed to generate preview: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}