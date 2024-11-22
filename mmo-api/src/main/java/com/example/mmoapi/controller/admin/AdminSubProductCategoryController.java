package com.example.mmoapi.controller.admin;

import com.example.mmoapi.beans.request.SubProductCategoryRequest;
import com.example.mmoapi.beans.response.productCategory.SubProductCategoryResponse;
import com.example.mmoapi.service.SubProductCategoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/sub-product-categories")
@RequiredArgsConstructor
@Tag(name = "AdminSubProductCategories")
public class AdminSubProductCategoryController {
    private final SubProductCategoryService subProductCategoryService;

//    @GetMapping
//    public ResponseEntity<List<SubProductCategoryResponse>> getAllSubProductCategories() {
//        List<SubProductCategoryResponse> subProductCategories = subProductCategoryService.getAllSubProductCategories();
//
//        if(subProductCategories.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        }
//
//        return ResponseEntity.ok(subProductCategories);
//    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> createSubProductCategory(@ModelAttribute SubProductCategoryRequest subProductCategoryRequest) {
        subProductCategoryService.addSubProductCategory(subProductCategoryRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> updateSubProductCategory(@PathVariable Integer id, @ModelAttribute SubProductCategoryRequest subProductCategoryRequest) {
        subProductCategoryService.updateSubProductCategory(id, subProductCategoryRequest);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubProductCategory(@PathVariable Integer id) {
        subProductCategoryService.deleteSubProductCategory(id);
        return ResponseEntity.noContent().build();
    }
}
