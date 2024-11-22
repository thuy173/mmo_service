package com.example.mmoapi.mapper;

import com.example.mmoapi.beans.request.PostCategoryRequest;
import com.example.mmoapi.beans.response.postCategory.PostCategoryResponse;
import com.example.mmoapi.beans.response.postCategory.ShortPostCategoryRes;
import com.example.mmoapi.entity.PostCategory;
import com.example.mmoapi.service.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PostCategoryMapper {
    private final UploadService uploadService;

    public void convertToRequest(PostCategory postCategory, PostCategoryRequest postCategoryRequest) {
        postCategory.setName(postCategoryRequest.getName());
        postCategory.setDescription(postCategoryRequest.getDescription());

        if (postCategoryRequest.getImage() != null && !postCategoryRequest.getImage().isEmpty()) {
            String uploadUrl = uploadService.uploadFile(postCategoryRequest.getImage());
            postCategory.setImageUrl(uploadUrl);
        } else {
            postCategory.setImageUrl(postCategory.getImageUrl());
        }

        postCategory.setActive(postCategoryRequest.isActive());
    }

    public PostCategoryResponse convertToResponse(PostCategory postCategory) {
        PostCategoryResponse postCategoryResponse = new PostCategoryResponse();
        postCategoryResponse.setId(postCategory.getId());
        postCategoryResponse.setName(postCategory.getName());
        postCategoryResponse.setDescription(postCategory.getDescription());
        postCategoryResponse.setImage(postCategory.getImageUrl());
        postCategoryResponse.setActive(postCategory.isActive());
        return postCategoryResponse;
    }

    public ShortPostCategoryRes convertToShortResponse(PostCategory postCategory) {
        ShortPostCategoryRes shortPostCategoryRes = new ShortPostCategoryRes();
        shortPostCategoryRes.setId(postCategory.getId());
        shortPostCategoryRes.setName(postCategory.getName());
        shortPostCategoryRes.setImage(postCategory.getImageUrl());
        return shortPostCategoryRes;
    }
}
