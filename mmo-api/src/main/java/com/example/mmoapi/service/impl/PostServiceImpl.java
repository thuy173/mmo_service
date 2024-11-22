package com.example.mmoapi.service.impl;

import com.example.mmoapi.beans.request.PostRequest;
import com.example.mmoapi.beans.response.post.PostResponse;
import com.example.mmoapi.beans.response.post.ShortPostResponse;
import com.example.mmoapi.entity.Post;
import com.example.mmoapi.entity.User;
import com.example.mmoapi.exception.ResourceNotFoundException;
import com.example.mmoapi.mapper.PostMapper;
import com.example.mmoapi.repository.PostRepository;
import com.example.mmoapi.repository.UserRepository;
import com.example.mmoapi.service.PostService;
import com.example.mmoapi.specification.PostSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
    private final PostRepository postRepository;
    private final PostMapper postMapper;
    private final UserRepository userRepository;

    @Override
    public Page<PostResponse> getAllDetailPosts(String title, Integer postCategoryId, LocalDateTime createdAt, Integer daysRange, int pageNumber, int pageSize, String sortField, Sort.Direction sortDirection) {
        Specification<Post> specification = PostSpecification.getPostByCriteria(title,postCategoryId, createdAt, daysRange);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortDirection, sortField));
        Page<Post> posts = postRepository.findAll(specification, pageable);

        return posts.map(postMapper::convertToResponse);
    }

    @Override
    public Page<ShortPostResponse> getAllShortPosts(String title, Integer postCategoryId, int pageNumber, int pageSize, String sortField, Sort.Direction sortDirection) {
        Specification<Post> specification = PostSpecification.getPostByCriteria(title,postCategoryId, null, null);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortDirection, sortField));
        Page<Post> posts = postRepository.findAll(specification, pageable);

        return posts.map(postMapper::convertToShortResponse);
    }

    @Override
    public PostResponse getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post with id " + id + " not found"));

        return postMapper.convertToResponse(post);
    }

    @Override
    public void addPost(String username, PostRequest postRequest) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Post post = new Post();
        postMapper.convertToRequest(post, postRequest, user);
        postRepository.save(post);
    }

    @Override
    public void updatePost(Long id, String username, PostRequest postRequest) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post with id " + id + " not found"));

        postMapper.convertToRequest(post, postRequest, user);
        postRepository.save(post);
    }

    @Override
    public void deletePost(Long id) {
        postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post with id " + id + " not found"));
        postRepository.deleteById(id);
    }
}
