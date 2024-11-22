package com.example.mmoapi.service;

import com.example.mmoapi.beans.request.PostRequest;
import com.example.mmoapi.beans.response.post.PostResponse;
import com.example.mmoapi.beans.response.post.ShortPostResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public interface PostService {
    Page<PostResponse> getAllDetailPosts(
            String title,
            Integer postCategoryId,
            LocalDateTime createdAt,
            Integer daysRange,
            int pageNumber,
            int pageSize,
            String sortField,
            Sort.Direction sortDirection
    );

    Page<ShortPostResponse> getAllShortPosts(
            String title,
            Integer postCategoryId,
            int pageNumber,
            int pageSize,
            String sortField,
            Sort.Direction sortDirection
    );

    PostResponse getPostById(Long id);

    void addPost(String username, PostRequest postRequest);

    void updatePost(Long id, String username, PostRequest postRequest);

    void deletePost(Long id);
}
