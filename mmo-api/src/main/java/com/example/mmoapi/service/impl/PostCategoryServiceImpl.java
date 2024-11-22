package com.example.mmoapi.service.impl;

import com.example.mmoapi.beans.request.PostCategoryRequest;
import com.example.mmoapi.beans.response.postCategory.PostCategoryResponse;
import com.example.mmoapi.beans.response.postCategory.ShortPostCategoryRes;
import com.example.mmoapi.entity.PostCategory;
import com.example.mmoapi.exception.ResourceNotFoundException;
import com.example.mmoapi.mapper.PostCategoryMapper;
import com.example.mmoapi.repository.PostCategoryRepository;
import com.example.mmoapi.service.PostCategoryService;
import com.example.mmoapi.specification.PostCategorySpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostCategoryServiceImpl implements PostCategoryService {
    private final PostCategoryRepository postCategoryRepository;
    private final PostCategoryMapper postCategoryMapper;

    @Override
    public Page<PostCategoryResponse> getAllPostCategories(String name, int pageNumber, int pageSize, String sortField, Sort.Direction sortDirection) {
        Specification<PostCategory> specification = PostCategorySpecification.getPostCategoryByCriteria(name);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortDirection, sortField));
        Page<PostCategory> postCategories = postCategoryRepository.findAll(specification, pageable);

        return postCategories.map(postCategoryMapper::convertToResponse);
    }

    @Override
    public Page<ShortPostCategoryRes> getAllShortPostCategories(int pageNumber, int pageSize, String sortField, Sort.Direction sortDirection) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortDirection, sortField));
        Page<PostCategory> postCategories = postCategoryRepository.findAll(pageable);

        return postCategories.map(postCategoryMapper::convertToShortResponse);
    }

    @Override
    public void addPostCategory(PostCategoryRequest postCategoryRequest) {
        PostCategory postCategory = new PostCategory();
        postCategoryMapper.convertToRequest(postCategory, postCategoryRequest);
        postCategoryRepository.save(postCategory);
    }

    @Override
    public void updatePostCategory(Integer id, PostCategoryRequest postCategoryRequest) {
        PostCategory postCategory = postCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post category with id " + id + " not found"));
        postCategoryMapper.convertToRequest(postCategory, postCategoryRequest);
        postCategoryRepository.save(postCategory);
    }

    @Override
    public void deletePostCategory(Integer id) {
        postCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post category with id " + id + " not found"));
        postCategoryRepository.deleteById(id);
    }
}
