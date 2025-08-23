package com.resumegenerator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

/**
 * Resume Controller - Handles HTTP requests for resume generation
 * 
 * This controller acts as the "waiter" in our restaurant:
 * - Takes orders (user data) from customers (frontend)
 * - Sends orders to the kitchen (LaTeXService)
 * - Delivers the finished meal (PDF resume) back to customers
 */
@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")

public class ResumeController {

    @Autowired
    private LaTeXService laTeXService;

    /**
     * Generate resume PDF from user data
     * 
     * POST /api/resume/generate
     * 
     * @param requestData Map containing user's resume data
     * @return PDF file as byte array
     */
    @PostMapping("/generate")
    public ResponseEntity<byte[]> generateResume(@RequestBody Map<String, String> requestData) {
        try {
            System.out.println("📨 Received resume generation request");
            System.out.println("📋 User data: " + requestData.keySet());
            
            // Generate PDF using our LaTeX service
            byte[] pdfBytes = laTeXService.generateResume(requestData);
            
            // Prepare HTTP headers for PDF download
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "resume.pdf");
            headers.setContentLength(pdfBytes.length);
            
            System.out.println("✅ Resume generated successfully!");
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            System.err.println("❌ Error generating resume: " + e.getMessage());
            e.printStackTrace();
            
            return new ResponseEntity<>(
                "Error generating resume".getBytes(), 
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    
    /**
     * Test endpoint with sample data
     * 
     * GET /api/resume/test
     * 
     * This creates a sample resume to test if everything works
     */
    @GetMapping("/test")
    public ResponseEntity<byte[]> testResumeGeneration() {
        try {
            System.out.println("🧪 Testing resume generation with sample data");
            
            // Create sample data
            Map<String, String> sampleData = createSampleData();
            
            // Generate PDF
            byte[] pdfBytes = laTeXService.generateResume(sampleData);
            
            // Prepare headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "test-resume.pdf");
            headers.setContentLength(pdfBytes.length);
            
            System.out.println("✅ Test resume generated successfully!");
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            System.err.println("❌ Error in test generation: " + e.getMessage());
            e.printStackTrace();
            
            return new ResponseEntity<>(
                "Test generation failed".getBytes(), 
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    
    /**
     * Get the list of available placeholders
     * 
     * GET /api/resume/placeholders
     * 
     * This tells users what fields they can customize
     */
    @GetMapping("/placeholders")
    public ResponseEntity<Map<String, String>> getPlaceholders() {
        Map<String, String> placeholders = new HashMap<>();
        placeholders.put("PROFESSIONAL_SUMMARY", "Professional summary bullet points (as LaTeX \\item list)");
        placeholders.put("TECHNICAL_SKILLS", "Technical skills table content (as LaTeX table rows)");
        placeholders.put("METLIFE_BULLET_POINTS", "MetLife experience bullet points (as LaTeX \\item list)");
        placeholders.put("ADONS_BULLET_POINTS", "Adons experience bullet points (as LaTeX \\item list)");
        
        return ResponseEntity.ok(placeholders);
    }
    
    /**
     * Create sample data for testing
     */
    private Map<String, String> createSampleData() {
        Map<String, String> sampleData = new HashMap<>();
        
        sampleData.put("PROFESSIONAL_SUMMARY", 
            "    \\item Experienced software engineer with 5+ years in full-stack development\n" +
            "    \\item Expert in Java, Spring Boot, and React technologies\n" +
            "    \\item Proven track record of delivering high-quality software solutions\n" +
            "    \\item Strong problem-solving skills and team collaboration abilities");
        
        sampleData.put("TECHNICAL_SKILLS", 
            "Languages & Java, Python, JavaScript, TypeScript \\\\\n" +
            "Frameworks & Spring Boot, React.js, Node.js, Express.js \\\\\n" +
            "Databases & MySQL, PostgreSQL, MongoDB \\\\\n" +
            "Tools & Git, Docker, Jenkins, AWS");
        
        sampleData.put("METLIFE_BULLET_POINTS", 
            "    \\item Developed microservices architecture improving system scalability by \\textbf{40\\%}\n" +
            "    \\item Led a team of 5 developers in agile development practices\n" +
            "    \\item Implemented CI/CD pipelines reducing deployment time by \\textbf{60\\%}\n" +
            "    \\item Collaborated with product managers to deliver user-focused features");
        
        sampleData.put("ADONS_BULLET_POINTS", 
            "    \\item Built responsive web applications using modern JavaScript frameworks\n" +
            "    \\item Optimized database queries resulting in \\textbf{50\\%} performance improvement\n" +
            "    \\item Mentored junior developers in best coding practices\n" +
            "    \\item Participated in code reviews ensuring high code quality standards");
        
        return sampleData;
    }
    /**
     * Simple test for cover letter generation
     * 
     * GET /api/resume/test-cover-letter-simple
     */
    /**
     * Simple test for cover letter generation
     * 
     * GET /api/resume/test-cover-letter-simple
     */
    /**
     * Simple test for cover letter generation
     * 
     * GET /api/resume/test-cover-letter-simple
     */
    @GetMapping("/test-cover-letter-simple")
    public ResponseEntity<byte[]> testCoverLetterSimple() {
        try {
            System.out.println("🧪 Testing cover letter with simple data");
            
            // Create very simple test data for your template
            Map<String, String> simpleData = new HashMap<>();
            simpleData.put("COVER_LETTER_DATE", "January 18, 2025");
            simpleData.put("COMPANY_NAME", "Google Inc.");
            simpleData.put("COMPANY_ADDRESS", "1600 Amphitheatre Parkway\\\\Mountain View, CA 94043");
            simpleData.put("SALUTATION", "Hiring Manager");
            simpleData.put("CONTENT", "I am writing to express my interest in the Software Engineer position at Google. With my experience in Java and React development, I believe I would be a great fit for your team.\\n\\nThank you for considering my application.");
            
            // Use the new cover letter service method
            byte[] pdfBytes = laTeXService.generateCoverLetter(simpleData);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "test-cover-letter.pdf");
            headers.setContentLength(pdfBytes.length);
            
            System.out.println("✅ Simple cover letter test successful!");
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            System.err.println("❌ Error in simple cover letter test: " + e.getMessage());
            e.printStackTrace();
            
            return new ResponseEntity<>(
                "Test failed".getBytes(), 
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    /**
     * Generate cover letter PDF from user data
     * 
     * POST /api/resume/generate-cover-letter
     * 
     * @param requestData Map containing user's cover letter data
     * @return PDF file as byte array
     */
    @PostMapping("/generate-cover-letter")
    public ResponseEntity<byte[]> generateCoverLetter(@RequestBody Map<String, String> requestData) {
        try {
            System.out.println("📨 Received cover letter generation request");
            System.out.println("📋 User data: " + requestData.keySet());
            System.out.println("📝 Data content: " + requestData);
            
            // Generate PDF using our LaTeX service
            byte[] pdfBytes = laTeXService.generateCoverLetter(requestData);
            
            // Prepare HTTP headers for PDF download
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "cover-letter.pdf");
            headers.setContentLength(pdfBytes.length);
            
            System.out.println("✅ Cover letter generated successfully!");
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            System.err.println("❌ Error generating cover letter: " + e.getMessage());
            e.printStackTrace();
            
            return new ResponseEntity<>(
                "Error generating cover letter".getBytes(), 
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}