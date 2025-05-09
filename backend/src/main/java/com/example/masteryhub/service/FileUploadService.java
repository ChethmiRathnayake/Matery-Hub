package com.example.masteryhub.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileUploadService {

    @Value("${image.upload-dir}")
    private String uploadDir;

    public String uploadFile(MultipartFile file) throws IOException {
        // Ensure the upload directory exists

        System.out.println("cam in upload");
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();  // Create directories if they do not exist
        }

        System.out.println(directory.exists());

        // Generate a unique filename to avoid conflicts
        String uniqueFileName = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();

        // Define the path where the file will be stored
        Path filePath = Paths.get(uploadDir, uniqueFileName);

        // Save the file to the directory
        Files.copy(file.getInputStream(), filePath);

        // Return the relative file path (you could use a full URL if necessary)
        return uniqueFileName;
    }

    @Value("${post.upload-dir}")
    private String postUploadDir;

    public String uploadPostFile(MultipartFile file) throws IOException {
        File directory = new File(postUploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        String uniqueFileName = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
        Path filePath = Paths.get(postUploadDir, uniqueFileName);

        Files.copy(file.getInputStream(), filePath);

        return uniqueFileName;
    }



}
