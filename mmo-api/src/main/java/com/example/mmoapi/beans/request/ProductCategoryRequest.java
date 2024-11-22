package com.example.mmoapi.beans.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductCategoryRequest {

    private String name;
    private MultipartFile icon;
    private String description;
    private Boolean isActive;
    private int orderNum;
}
