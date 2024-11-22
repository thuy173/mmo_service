package com.example.mmoapi.controller.site;

import com.example.mmoapi.beans.response.postCategory.ShortPostCategoryRes;
import com.example.mmoapi.service.PostCategoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/post-categories")
@RequiredArgsConstructor
@Tag(name = "PostCategories")
public class PostCategoryController {
    private final PostCategoryService postCategoryService;

    @GetMapping
    public ResponseEntity<Page<ShortPostCategoryRes>> getAllPostCategories(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "id") String sortField,
            @RequestParam(defaultValue = "ASC") Sort.Direction sortDirection) {

        Page<ShortPostCategoryRes> postCategories = postCategoryService.getAllShortPostCategories(
                pageNumber, pageSize, sortField, sortDirection);

        return ResponseEntity.ok(postCategories);
    }

}
