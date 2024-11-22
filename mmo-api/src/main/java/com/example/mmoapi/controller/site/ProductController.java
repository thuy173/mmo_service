package com.example.mmoapi.controller.site;

import com.example.mmoapi.beans.response.product.ProductResponse;
import com.example.mmoapi.beans.response.product.ShortProductResponse;
import com.example.mmoapi.service.ProductService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Products")
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ShortProductResponse>> getAllProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer subProductCategoryId,
            @RequestParam(required = false, defaultValue = "0") int pageNumber,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "id") String sortField,
            @RequestParam(required = false, defaultValue = "ASC") Sort.Direction sortDirection
    ) {
        Page<ShortProductResponse> products = productService.getAllProducts(name, subProductCategoryId, true,  pageNumber, pageSize, sortField, sortDirection);

        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

}
