package com.example.mmoapi.controller.admin;

import com.example.mmoapi.beans.request.PostCategoryRequest;
import com.example.mmoapi.beans.response.postCategory.PostCategoryResponse;
import com.example.mmoapi.service.PostCategoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/post-category")
@RequiredArgsConstructor
@Tag(name = "AdminPostCategories")
public class AdminPostCategoryController {
    private final PostCategoryService postCategoryService;

    @GetMapping
    public ResponseEntity<Page<PostCategoryResponse>> getAllPostCategories(
            @RequestParam(required = false) String name,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "id") String sortField,
            @RequestParam(defaultValue = "ASC") Sort.Direction sortDirection) {

        Page<PostCategoryResponse> postCategories = postCategoryService.getAllPostCategories(
                name, pageNumber, pageSize, sortField, sortDirection);

        return ResponseEntity.ok(postCategories);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> createPostCategory(@ModelAttribute  PostCategoryRequest postCategoryRequest) {
        postCategoryService.addPostCategory(postCategoryRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> updatePostCategory(@PathVariable Integer id, @ModelAttribute PostCategoryRequest postCategoryRequest) {
        postCategoryService.updatePostCategory(id, postCategoryRequest);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePostCategory(@PathVariable Integer id) {
        postCategoryService.deletePostCategory(id);
        return ResponseEntity.noContent().build();
    }
}
