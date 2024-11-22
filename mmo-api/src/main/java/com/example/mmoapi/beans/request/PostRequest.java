package com.example.mmoapi.beans.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostRequest {
    private String title;
    private Integer postCategoryId;
    private MultipartFile thumbnail;
    private String shortContent;
    private String content;
    private boolean isActive;

}
