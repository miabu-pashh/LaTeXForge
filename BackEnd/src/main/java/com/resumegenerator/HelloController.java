package com.resumegenerator;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Our first REST Controller
 * 
 * @RestController tells Spring: "This class handles web requests"
 * Think of this as a waiter who takes orders and brings responses
 */
@RestController
public class HelloController {

    /**
     * Our first endpoint
     * 
     * @GetMapping("/") means: "When someone visits the homepage, run this method"
     * This is like saying: "When a customer asks for the main menu, give them this"
     */
    @GetMapping("/")
    public String home() {
        return "🚀 Resume Generator is Running! Welcome to our application.";
    }

    /**
     * A test endpoint to make sure everything works
     * 
     * @GetMapping("/test") means: "When someone visits /test, run this method"
     */
    @GetMapping("/test")
    public String test() {
        return "✅ Test successful! The server is working perfectly.";
    }
}