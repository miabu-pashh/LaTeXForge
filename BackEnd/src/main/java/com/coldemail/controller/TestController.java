package com.coldemail.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:3000")

public class TestController {
    
    @GetMapping("/hello")
    public String hello() {
        return "Hello from Cold Email Backend!";
    }
    
    @GetMapping("/status")
    public String status() {
        return "Backend is running successfully!";
    }
}