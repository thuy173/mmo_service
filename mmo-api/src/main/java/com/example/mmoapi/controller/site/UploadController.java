package com.example.mmoapi.controller.site;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
@Tag(name = "Upload")
public class UploadController {
    private final Cloudinary cloudinary;

    @PostMapping(value = "/file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> uploadOne(@RequestParam MultipartFile file) {
        if (file.isEmpty())
            throw new IllegalArgumentException("Cannot upload empty file");

        try {
            String fileType = file.getContentType().split("/")[0];
            String resourceType = fileType.equals("video") ? "video" : "image";
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("resource_type", resourceType));
            String imageUrl = uploadResult.get("url").toString();

            return ResponseEntity.ok(imageUrl);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    @PostMapping(value = "/files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<String>> uploadMany(@RequestParam List<MultipartFile> files) {
        if (files.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file list");
        }

        List<String> uploadedImageUrls = new ArrayList<>();

        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                try {
                    Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
                    String imageUrl = uploadResult.get("url").toString();
                    uploadedImageUrls.add(imageUrl);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to upload image: " + file.getOriginalFilename(), e);
                }
            } else {
                uploadedImageUrls.add("Failed to upload empty file: " + file.getOriginalFilename());
            }
        }

        return ResponseEntity.ok(uploadedImageUrls);
    }
}
