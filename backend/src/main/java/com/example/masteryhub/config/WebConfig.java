package com.example.masteryhub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Map "/uploads/**" to the actual folder on the server
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/images/");  // "file:" tells Spring Boot to look in the local file system
    }
}
