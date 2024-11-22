package com.example.mmoapi.service;

import com.example.mmoapi.beans.request.ProductRequest;
import com.example.mmoapi.beans.response.product.ProductResponse;
import com.example.mmoapi.beans.response.product.ShortProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public interface ProductService {
    Page<ShortProductResponse> getAllProducts(
            String name,
            Integer subProductCategoryId,
            Boolean isActive,
            int pageNumber,
            int pageSize,
            String sortField,
            Sort.Direction sortDirection
    );

    ProductResponse getProductById(Long id);
    long countProducts();
    void addProduct(ProductRequest productRequest);

    void updateProduct(Long id, ProductRequest productRequest);

    void deleteProduct(Long id);
}
