package com.example.mmoapi.controller.admin;

import com.example.mmoapi.beans.request.ProductCategoryRequest;
import com.example.mmoapi.beans.response.productCategory.FullProductCategoryResponse;
import com.example.mmoapi.beans.response.productCategory.ProductCategoryResponse;
import com.example.mmoapi.service.ProductCategoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/product-categories")
@RequiredArgsConstructor
@Tag(name = "AdminProductCategories")
public class AdminProductCategoryController {
    private final ProductCategoryService productCategoryService;

    @GetMapping
    public ResponseEntity<List<ProductCategoryResponse>> getAllProductCategories() {
        List<ProductCategoryResponse> productCategories = productCategoryService.getAllProductCategories();

        return ResponseEntity.ok(productCategories);
    }

    @GetMapping("get-all")
    public ResponseEntity<List<FullProductCategoryResponse>> getFullProductCategories() {
        List<FullProductCategoryResponse> productCategories = productCategoryService.getAllFullProductCategories();

        return ResponseEntity.ok(productCategories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FullProductCategoryResponse> getProductCategoryById(@PathVariable Integer id) {
        return ResponseEntity.ok(productCategoryService.getProductCategoryById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> createProductCategory(@ModelAttribute ProductCategoryRequest productCategoryRequest) {
        productCategoryService.addProductCategory(productCategoryRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping(value ="/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> updateProductCategory(@PathVariable Integer id, @ModelAttribute ProductCategoryRequest productCategoryRequest) {
        productCategoryService.updateProductCategory(id, productCategoryRequest);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductCategory(@PathVariable Integer id) {
        productCategoryService.deleteProductCategory(id);
        return ResponseEntity.noContent().build();
    }
}
