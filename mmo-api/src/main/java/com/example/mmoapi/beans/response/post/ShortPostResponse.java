package com.example.mmoapi.beans.response.post;

import com.example.mmoapi.beans.response.postCategory.ShortPostCategoryRes;
import com.example.mmoapi.beans.response.user.ShortUserResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShortPostResponse {
    private Long id;
    private String title;
    private ShortPostCategoryRes postCategory;
    private String thumbnail;
    private String shortContent;
    private ShortUserResponse author;
    private LocalDateTime updatedAt;
}
