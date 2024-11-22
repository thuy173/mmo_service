package com.example.mmoapi.beans.response.postCategory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostCategoryResponse {
    private Integer id;
    private String name;
    private String image;
    private String description;
    private boolean isActive;
}
