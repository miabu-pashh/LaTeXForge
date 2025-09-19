package com.resumegenerator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.resumegenerator", "com.coldemail", "com.emailmanager"})
public class ResumeGeneratorApplication {

	public static void main(String[] args) {
		SpringApplication.run(ResumeGeneratorApplication.class, args);
	}

}
