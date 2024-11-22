package com.example.mmoapi.controller.admin;

import com.example.mmoapi.beans.request.ProductRequest;
import com.example.mmoapi.beans.response.product.ProductResponse;
import com.example.mmoapi.beans.response.product.ShortProductResponse;
import com.example.mmoapi.service.ProductService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
@Tag(name = "AdminProducts")
public class AdminProductController {
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ShortProductResponse>> getAllProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer subProductCategoryId,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false, defaultValue = "0") int pageNumber,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "id") String sortField,
            @RequestParam(required = false, defaultValue = "ASC") Sort.Direction sortDirection
    ) {
        Page<ShortProductResponse> shortProducts = productService.getAllProducts(name, subProductCategoryId, isActive,  pageNumber, pageSize, sortField, sortDirection);

        return ResponseEntity.ok(shortProducts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> createProduct(@ModelAttribute ProductRequest productRequest) {
        productService.addProduct(productRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> updateProduct(@PathVariable Long id, @ModelAttribute ProductRequest productRequest) {
        productService.updateProduct(id, productRequest);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
