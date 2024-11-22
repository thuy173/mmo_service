package com.example.mmoapi.controller.site;

import com.example.mmoapi.beans.response.post.PostResponse;
import com.example.mmoapi.beans.response.post.ShortPostResponse;
import com.example.mmoapi.service.PostService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Tag(name = "Posts")
public class PostController {
    private final PostService postService;

    @GetMapping
    public ResponseEntity<Page<ShortPostResponse>> getAllPosts(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Integer postCategoryId,
            @RequestParam(required = false, defaultValue = "0") int pageNumber,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "id") String sortField,
            @RequestParam(required = false, defaultValue = "ASC") Sort.Direction sortDirection
    ) {
        Page<ShortPostResponse> posts = postService.getAllShortPosts(title, postCategoryId, pageNumber, pageSize, sortField, sortDirection);

        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }
}
