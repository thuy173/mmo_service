package com.example.mmoapi.controller.site;

import com.example.mmoapi.beans.response.productCategory.FullProductCategoryResponse;
import com.example.mmoapi.service.ProductCategoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/product-categories")
@RequiredArgsConstructor
@Tag(name = "ProductCategories")
public class ProductCategoryController {
    private final ProductCategoryService productCategoryService;

    @GetMapping
    public ResponseEntity<List<FullProductCategoryResponse>> getAllProductCategories() {
        List<FullProductCategoryResponse> productCategories = productCategoryService.getAllFullProductCategories();

        return ResponseEntity.ok(productCategories);
    }
}
