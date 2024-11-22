package com.example.mmoapi.mapper;

import com.example.mmoapi.beans.request.PostRequest;
import com.example.mmoapi.beans.response.post.PostResponse;
import com.example.mmoapi.beans.response.post.ShortPostResponse;
import com.example.mmoapi.beans.response.postCategory.ShortPostCategoryRes;
import com.example.mmoapi.beans.response.user.ShortUserResponse;
import com.example.mmoapi.entity.Post;
import com.example.mmoapi.entity.PostCategory;
import com.example.mmoapi.entity.User;
import com.example.mmoapi.exception.ResourceNotFoundException;
import com.example.mmoapi.repository.PostCategoryRepository;
import com.example.mmoapi.service.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class PostMapper {
    private final PostCategoryRepository postCategoryRepository;
    private final UploadService uploadService;

    public void convertToRequest(Post post, PostRequest postRequest, User user) {
        PostCategory postCategory = postCategoryRepository.findById(postRequest.getPostCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Post category not found"));

        post.setAuthor(user);
        post.setTitle(postRequest.getTitle());
        post.setPostCategory(postCategory);

        if (postRequest.getThumbnail() != null && !postRequest.getThumbnail().isEmpty()) {
            String uploadUrl = uploadService.uploadFile(postRequest.getThumbnail());
            post.setThumbnailUrl(uploadUrl);
        } else {
            post.setThumbnailUrl(post.getThumbnailUrl());
        }

        post.setShortContent(postRequest.getShortContent());
        post.setContent(postRequest.getContent());
        post.setActive(postRequest.isActive());
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
    }

    public PostResponse convertToResponse(Post post) {
        PostResponse postResponse = new PostResponse();
        postResponse.setId(post.getId());

        ShortPostCategoryRes shortPostCategoryRes = new ShortPostCategoryRes(
                post.getPostCategory().getId(),
                post.getPostCategory().getName(),
                post.getPostCategory().getImageUrl()
        );

        postResponse.setPostCategory(shortPostCategoryRes);

        ShortUserResponse shortUserResponse = new ShortUserResponse(
                post.getAuthor().getId(),
                post.getAuthor().getFullName(),
                post.getAuthor().getUsername(),
                post.getAuthor().getAvatar()
        );

        postResponse.setAuthor(shortUserResponse);

        postResponse.setTitle(post.getTitle());
        postResponse.setThumbnail(post.getThumbnailUrl());
        postResponse.setShortContent(post.getShortContent());
        postResponse.setContent(post.getContent());
        postResponse.setActive(post.isActive());
        postResponse.setCreatedAt(post.getCreatedAt());
        postResponse.setUpdatedAt(post.getUpdatedAt());
        return postResponse;
    }

    public ShortPostResponse convertToShortResponse(Post post) {
        ShortPostResponse shortPostResponse = new ShortPostResponse();
        shortPostResponse.setId(post.getId());

        ShortPostCategoryRes shortPostCategoryRes = new ShortPostCategoryRes(
                post.getPostCategory().getId(),
                post.getPostCategory().getName(),
                post.getPostCategory().getImageUrl()
        );

        shortPostResponse.setPostCategory(shortPostCategoryRes);

        ShortUserResponse shortUserResponse = new ShortUserResponse(
                post.getAuthor().getId(),
                post.getAuthor().getFullName(),
                post.getAuthor().getUsername(),
                post.getAuthor().getAvatar()
        );
        shortPostResponse.setAuthor(shortUserResponse);

        shortPostResponse.setTitle(post.getTitle());
        shortPostResponse.setThumbnail(post.getThumbnailUrl());
        shortPostResponse.setShortContent(post.getShortContent());
        shortPostResponse.setUpdatedAt(post.getUpdatedAt());
        return shortPostResponse;
    }
}
