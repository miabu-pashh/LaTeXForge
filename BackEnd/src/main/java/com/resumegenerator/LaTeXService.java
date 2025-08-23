package com.resumegenerator;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import java.io.*;
import java.nio.file.*;
import java.util.Map;

/**
 * LaTeX Processing Service
 * 
 * This service handles:
 * 1. Reading the LaTeX template
 * 2. Replacing placeholders with user data
 * 3. Generating PDF from LaTeX
 * 
 * Think of this as the "kitchen" where we prepare the resume
 */
@Service
public class LaTeXService {

    /**
     * Generate resume PDF from user data
     * 
     * @param userData Map containing placeholder values
     * @return byte array of the generated PDF
     * @throws Exception if generation fails
     */
    public byte[] generateResume(Map<String, String> userData) throws Exception {
        
        // Step 1: Create temporary directory for processing
        Path tempDir = createTempDirectory();
        System.out.println("📁 Created temp directory: " + tempDir);
        
        try {
            // Step 2: Copy template files to temp directory
            copyTemplateFiles(tempDir);
            
            // Step 3: Replace placeholders with user data
            String processedTemplate = processTemplate(userData);
            
            // Step 4: Write processed template to temp directory
            Path texFile = tempDir.resolve("resume.tex");
            Files.write(texFile, processedTemplate.getBytes());
            System.out.println("📝 Created processed .tex file");
            
            // Step 5: Generate PDF using LaTeX
            generatePDF(tempDir);
            
            // Step 6: Read the generated PDF
            Path pdfFile = tempDir.resolve("resume.pdf");
            byte[] pdfBytes = Files.readAllBytes(pdfFile);
            System.out.println("✅ PDF generated successfully! Size: " + pdfBytes.length + " bytes");
            
            return pdfBytes;
            
        } finally {
            // Step 7: Clean up temporary files
            cleanupTempDirectory(tempDir);
        }
    }
    
    /**
     * Create a temporary directory for LaTeX processing
     */
    private Path createTempDirectory() throws IOException {
        return Files.createTempDirectory("resume-generator-");
    }
    
    /**
     * Copy template files (.tex and .cls) to temporary directory
     */
    private void copyTemplateFiles(Path tempDir) throws IOException {
        // Copy the .cls file
        ClassPathResource clsResource = new ClassPathResource("templates/resume.cls");
        Path clsFile = tempDir.resolve("resume.cls");
        Files.copy(clsResource.getInputStream(), clsFile);
        System.out.println("📋 Copied resume.cls to temp directory");
    }
    
    /**
     * Read template and replace placeholders with user data
     */
    private String processTemplate(Map<String, String> userData) throws IOException {
        // Read the template file
        ClassPathResource templateResource = new ClassPathResource("templates/resume-template.tex");
        String template;
        
        try (InputStream inputStream = templateResource.getInputStream()) {
            template = new String(inputStream.readAllBytes());
        }
        
        System.out.println("📖 Read template file");
        
        // Replace each placeholder with user data
        String processedTemplate = template;
        for (Map.Entry<String, String> entry : userData.entrySet()) {
            String placeholder = "{{" + entry.getKey() + "}}";
            String value = entry.getValue() != null ? entry.getValue() : "";
            processedTemplate = processedTemplate.replace(placeholder, value);
            System.out.println("🔄 Replaced " + placeholder + " with user data");
        }
        
        return processedTemplate;
    }
    
    /**
     * Generate PDF using pdflatex command
     */
    private void generatePDF(Path tempDir) throws IOException, InterruptedException {
        System.out.println("🔧 Starting PDF generation...");
        
        // Build the pdflatex command
        ProcessBuilder processBuilder = new ProcessBuilder(
            "pdflatex", 
            "-interaction=nonstopmode", // Don't stop for errors
            "-output-directory=" + tempDir.toString(),
            "resume.tex"
        );
        
        processBuilder.directory(tempDir.toFile());
        processBuilder.redirectErrorStream(true); // Combine stdout and stderr
        
        // Execute the command
        Process process = processBuilder.start();
        
        // Capture output for debugging
        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
        }
        
        // Wait for completion
        int exitCode = process.waitFor();
        
        if (exitCode != 0) {
            System.err.println("❌ LaTeX compilation failed with exit code: " + exitCode);
            System.err.println("Output: " + output.toString());
            throw new RuntimeException("PDF generation failed");
        }
        
        System.out.println("✅ PDF generation completed successfully");
    }
    
    /**
     * Clean up temporary directory and files
     */
    private void cleanupTempDirectory(Path tempDir) {
        try {
            Files.walk(tempDir)
                .sorted((a, b) -> b.compareTo(a)) // Delete files before directories
                .forEach(path -> {
                    try {
                        Files.delete(path);
                    } catch (IOException e) {
                        System.err.println("⚠️ Could not delete: " + path);
                    }
                });
            System.out.println("🧹 Cleaned up temporary files");
        } catch (IOException e) {
            System.err.println("⚠️ Error during cleanup: " + e.getMessage());
        }
    }
    /**
     * Generate cover letter PDF (different from resume - no .cls file needed)
     */
    public byte[] generateCoverLetter(Map<String, String> userData) throws Exception {
        
        // Step 1: Create temporary directory for processing
        Path tempDir = createTempDirectory();
        System.out.println("📁 Created temp directory for cover letter: " + tempDir);
        
        try {
            // Step 2: Read and process cover letter template (no .cls file copying needed)
            String processedTemplate = processCoverLetterTemplate(userData);
            
            // Step 3: Write processed template to temp directory
            Path texFile = tempDir.resolve("cover-letter.tex");
            Files.write(texFile, processedTemplate.getBytes());
            System.out.println("📝 Created processed cover letter .tex file");
            
            // Step 4: Generate PDF using LaTeX
            generateCoverLetterPDF(tempDir);
            
            // Step 5: Read the generated PDF
            Path pdfFile = tempDir.resolve("cover-letter.pdf");
            byte[] pdfBytes = Files.readAllBytes(pdfFile);
            System.out.println("✅ Cover letter PDF generated successfully! Size: " + pdfBytes.length + " bytes");
            
            return pdfBytes;
            
        } finally {
            // Step 6: Clean up temporary files
            cleanupTempDirectory(tempDir);
        }
    }
    
    /**
     * Process cover letter template (separate from resume template)
     */
    private String processCoverLetterTemplate(Map<String, String> userData) throws IOException {
        // Read the cover letter template file
        ClassPathResource templateResource = new ClassPathResource("templates/cover-letter-template.tex");
        String template;
        
        try (InputStream inputStream = templateResource.getInputStream()) {
            template = new String(inputStream.readAllBytes());
        }
        
        System.out.println("📖 Read cover letter template file");
        
        // Replace each placeholder with user data
        String processedTemplate = template;
        for (Map.Entry<String, String> entry : userData.entrySet()) {
            String placeholder = "{{" + entry.getKey() + "}}";
            String value = entry.getValue() != null ? entry.getValue() : "";
            processedTemplate = processedTemplate.replace(placeholder, value);
            System.out.println("🔄 Replaced " + placeholder + " with user data");
        }
        
        return processedTemplate;
    }
    
    /**
     * Generate PDF for cover letter using pdflatex command
     */
    private void generateCoverLetterPDF(Path tempDir) throws IOException, InterruptedException {
        System.out.println("🔧 Starting cover letter PDF generation...");
        
        // Build the pdflatex command
        ProcessBuilder processBuilder = new ProcessBuilder(
            "pdflatex", 
            "-interaction=nonstopmode", // Don't stop for errors
            "-output-directory=" + tempDir.toString(),
            "cover-letter.tex"  // Different filename from resume
        );
        
        processBuilder.directory(tempDir.toFile());
        processBuilder.redirectErrorStream(true); // Combine stdout and stderr
        
        // Execute the command
        Process process = processBuilder.start();
        
        // Capture output for debugging
        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
        }
        
        // Wait for completion
        int exitCode = process.waitFor();
        
        // Check if PDF was actually created (sometimes LaTeX reports warnings as errors)
        Path pdfFile = tempDir.resolve("cover-letter.pdf");
        if (!Files.exists(pdfFile)) {
            System.err.println("❌ Cover letter LaTeX compilation failed with exit code: " + exitCode);
            System.err.println("Output: " + output.toString());
            throw new RuntimeException("Cover letter PDF generation failed - no PDF file created");
        }
        
        if (exitCode != 0) {
            System.out.println("⚠️ LaTeX reported warnings (exit code: " + exitCode + ") but PDF was created");
            System.out.println("Output: " + output.toString());
        }
        
        System.out.println("✅ Cover letter PDF generation completed successfully");
    }
}