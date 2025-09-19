// package com.emailmanager.service;

// import com.emailmanager.model.Email;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.scheduling.annotation.Scheduled;
// import org.springframework.stereotype.Service;

// import jakarta.mail.*;
// import jakarta.mail.internet.MimeMessage;
// import java.time.LocalDateTime;
// import java.time.ZoneId;
// import java.util.Date;
// import java.util.Properties;

// /**
//  * Gmail Integration Service - Fetches emails from Gmail via IMAP
//  */
// @Service
// public class GmailService {
    
//     @Autowired
//     private EmailService emailService;
    
//     @Value("${spring.mail.host}")
//     private String host;
    
//     @Value("${spring.mail.port}")
//     private String port;
    
//     @Value("${spring.mail.username}")
//     private String username;
    
//     @Value("${spring.mail.password}")
//     private String password;
    
//     /**
//      * Scheduled task to fetch emails from Gmail every 5 minutes
//      */
//     @Scheduled(fixedRate = 300000) // 5 minutes
//     public void fetchEmailsFromGmail() {
//         System.out.println("Starting Gmail email fetch...");
        
//         try {
//             // Setup mail properties
//             Properties properties = new Properties();
//             properties.put("mail.store.protocol", "imaps");
//             properties.put("mail.imap.ssl.enable", "true");
//             properties.put("mail.imap.ssl.trust", host);
//             properties.put("mail.imap.port", port);
            
//             // Create session and connect
//             Session session = Session.getInstance(properties);
//             Store store = session.getStore("imaps");
//             store.connect(host, username, password);
            
//             // Open INBOX folder
//             Folder inbox = store.getFolder("INBOX");
//             inbox.open(Folder.READ_ONLY);
            
//             // Get recent messages (last 50)
//             Message[] messages = inbox.getMessages(
//                 Math.max(1, inbox.getMessageCount() - 49), 
//                 inbox.getMessageCount()
//             );
            
//             System.out.println("Found " + messages.length + " messages to process");
            
//             // Process each message
//             for (Message message : messages) {
//                 try {
//                     processEmailMessage(message);
//                 } catch (Exception e) {
//                     System.err.println("Error processing message: " + e.getMessage());
//                 }
//             }
            
//             // Close connections
//             inbox.close(false);
//             store.close();
            
//             System.out.println("Gmail email fetch completed");
            
//         } catch (Exception e) {
//             System.err.println("Error fetching emails from Gmail: " + e.getMessage());
//             e.printStackTrace();
//         }
//     }
    
//     /**
//      * Process individual email message
//      */
//     private void processEmailMessage(Message message) throws Exception {
//         if (!(message instanceof MimeMessage)) {
//             return;
//         }
        
//         MimeMessage mimeMessage = (MimeMessage) message;
        
//         // Extract email details
//         String messageId = mimeMessage.getMessageID();
//         String subject = mimeMessage.getSubject() != null ? mimeMessage.getSubject() : "No Subject";
//         String sender = getSenderEmail(mimeMessage);
//         String recipient = getRecipientEmail(mimeMessage);
//         String content = getEmailContent(mimeMessage);
//         LocalDateTime receivedDate = getReceivedDate(mimeMessage);
        
//         // Check if we already processed this email
//         if (messageId != null) {
//             try {
//                 // Process the email through our service
//                 Email processedEmail = emailService.processEmail(
//                     messageId, subject, sender, recipient, content, receivedDate
//                 );
                
//                 System.out.println("Processed email: " + subject + " from " + sender);
                
//             } catch (Exception e) {
//                 // Email might already exist, which is fine
//                 if (!e.getMessage().contains("could not execute statement")) {
//                     System.err.println("Error saving email: " + e.getMessage());
//                 }
//             }
//         }
//     }
    
//     /**
//      * Extract sender email address
//      */
//     private String getSenderEmail(MimeMessage message) throws MessagingException {
//         Address[] from = message.getFrom();
//         if (from != null && from.length > 0) {
//             return from[0].toString();
//         }
//         return "Unknown Sender";
//     }
    
//     /**
//      * Extract recipient email address
//      */
//     private String getRecipientEmail(MimeMessage message) throws MessagingException {
//         Address[] recipients = message.getRecipients(Message.RecipientType.TO);
//         if (recipients != null && recipients.length > 0) {
//             return recipients[0].toString();
//         }
//         return username; // Default to our email
//     }
    
//     /**
//      * Extract email content
//      */
//     private String getEmailContent(MimeMessage message) {
//         try {
//             if (message.isMimeType("text/plain")) {
//                 return (String) message.getContent();
//             } else if (message.isMimeType("text/html")) {
//                 return (String) message.getContent();
//             } else if (message.isMimeType("multipart/*")) {
//                 return getTextFromMimeMultipart((Multipart) message.getContent());
//             } else {
//                 return "Content type not supported";
//             }
//         } catch (Exception e) {
//             System.err.println("Error extracting email content: " + e.getMessage());
//             return "Error reading content";
//         }
//     }
    
//     /**
//      * Extract text from multipart email
//      */
//     private String getTextFromMimeMultipart(Multipart multipart) throws Exception {
//         StringBuilder result = new StringBuilder();
//         int count = multipart.getCount();
        
//         for (int i = 0; i < count; i++) {
//             BodyPart bodyPart = multipart.getBodyPart(i);
            
//             if (bodyPart.isMimeType("text/plain")) {
//                 result.append(bodyPart.getContent().toString());
//             } else if (bodyPart.isMimeType("text/html")) {
//                 String html = bodyPart.getContent().toString();
//                 // Simple HTML strip - in production use a proper library
//                 result.append(html.replaceAll("<[^>]+>", ""));
//             } else if (bodyPart.isMimeType("multipart/*")) {
//                 result.append(getTextFromMimeMultipart((Multipart) bodyPart.getContent()));
//             }
//         }
        
//         return result.toString();
//     }
    
//     /**
//      * Convert message date to LocalDateTime
//      */
//     private LocalDateTime getReceivedDate(MimeMessage message) throws MessagingException {
//         Date receivedDate = message.getReceivedDate();
//         if (receivedDate == null) {
//             receivedDate = message.getSentDate();
//         }
//         if (receivedDate == null) {
//             receivedDate = new Date(); // Current time as fallback
//         }
        
//         return receivedDate.toInstant()
//                 .atZone(ZoneId.systemDefault())
//                 .toLocalDateTime();
//     }
    
//     /**
//      * Manual email fetch endpoint for testing
//      */
//     public void fetchEmailsManually() {
//         fetchEmailsFromGmail();
//     }
    
//     /**
//      * Test Gmail connection
//      */
//     public boolean testGmailConnection() {
//         try {
//             Properties properties = new Properties();
//             properties.put("mail.store.protocol", "imaps");
//             properties.put("mail.imap.ssl.enable", "true");
//             properties.put("mail.imap.ssl.trust", host);
//             properties.put("mail.imap.port", port);
            
//             Session session = Session.getInstance(properties);
//             Store store = session.getStore("imaps");
//             store.connect(host, username, password);
            
//             Folder inbox = store.getFolder("INBOX");
//             inbox.open(Folder.READ_ONLY);
            
//             int messageCount = inbox.getMessageCount();
//             System.out.println("Gmail connection successful. Message count: " + messageCount);
            
//             inbox.close(false);
//             store.close();
            
//             return true;
            
//         } catch (Exception e) {
//             System.err.println("Gmail connection failed: " + e.getMessage());
//             return false;
//         }
//     }
// }