package com.example.mmoapi.service.impl;

import com.cloudinary.Cloudinary;
import com.example.mmoapi.beans.request.ProductRequest;
import com.example.mmoapi.beans.response.product.ProductResponse;
import com.example.mmoapi.beans.response.product.ShortProductResponse;
import com.example.mmoapi.entity.Product;
import com.example.mmoapi.entity.ProductDetail;
import com.example.mmoapi.exception.ResourceNotFoundException;
import com.example.mmoapi.mapper.ProductMapper;
import com.example.mmoapi.repository.ProductDetailRepository;
import com.example.mmoapi.repository.ProductRepository;
import com.example.mmoapi.service.ProductService;
import com.example.mmoapi.specification.ProductSpecification;
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
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ProductDetailRepository productDetailRepository;

    @Override
    public Page<ShortProductResponse> getAllProducts(
            String name,
            Integer subProductCategoryId,
            Boolean isActive,
            int pageNumber,
            int pageSize,
            String sortField,
            Sort.Direction sortDirection
    ) {
        Specification<Product> specification = ProductSpecification.getProductByCriteria(name, subProductCategoryId, isActive);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortDirection, sortField));
        Page<Product> products = productRepository.findAll(specification, pageable);

        return products
                .map(product -> {
                    ProductDetail productDetail = productDetailRepository.findById(product.getId())
                            .orElseThrow(() -> new ResourceNotFoundException("ProductDetail not found for product id " + product.getId()));
                    return productMapper.convertToShortResponse(product, productDetail);
                });
    }

    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + id));
        ProductDetail productDetail = productDetailRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProductDetail not found with id " + id));
        return productMapper.convertToResponse(product, productDetail);
    }

    @Override
    public long countProducts() {
        return productRepository.count();
    }

    @Override
    public void addProduct(ProductRequest productRequest) {
        Product product = new Product();
        ProductDetail productDetail = new ProductDetail();
        productMapper.convertToRequest(product, productRequest);
        product = productRepository.save(product);

        productDetail.setProduct(product);
        productMapper.convertToDetailRequest(productDetail, productRequest);
        productDetailRepository.save(productDetail);
    }

    @Override
    public void updateProduct(Long id, ProductRequest productRequest) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + id));
        ProductDetail productDetail = productDetailRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProductDetail not found with id " + id));
        productMapper.convertToRequest(product, productRequest);
        productRepository.save(product);

        productMapper.convertToDetailRequest(productDetail, productRequest);
        productDetailRepository.save(productDetail);
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id " + id);
        }
        productRepository.deleteById(id);
        productDetailRepository.deleteById(id);
    }
}
