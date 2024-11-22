package com.example.mmoapi.service;

import com.example.mmoapi.beans.request.PostCategoryRequest;
import com.example.mmoapi.beans.response.postCategory.PostCategoryResponse;
import com.example.mmoapi.beans.response.postCategory.ShortPostCategoryRes;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public interface PostCategoryService {
    Page<PostCategoryResponse> getAllPostCategories(String name, int pageNumber, int pageSize, String sortField, Sort.Direction sortDirection);
    Page<ShortPostCategoryRes> getAllShortPostCategories(int pageNumber, int pageSize, String sortField, Sort.Direction sortDirection);
    void addPostCategory(PostCategoryRequest postCategoryRequest);
    void updatePostCategory(Integer id, PostCategoryRequest postCategoryRequest);
    void deletePostCategory(Integer id);
}
