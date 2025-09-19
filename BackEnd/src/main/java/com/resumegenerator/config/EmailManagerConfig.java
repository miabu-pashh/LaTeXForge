package com.resumegenerator.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
@EnableJpaRepositories(basePackages = "com.emailmanager.repository")
@EntityScan(basePackages = "com.emailmanager.model")
public class EmailManagerConfig {
    // Configuration for email manager components
}