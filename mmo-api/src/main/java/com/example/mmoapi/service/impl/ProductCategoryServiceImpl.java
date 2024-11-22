package com.example.mmoapi.service.impl;

import com.cloudinary.Cloudinary;
import com.example.mmoapi.beans.request.ProductCategoryRequest;
import com.example.mmoapi.beans.response.productCategory.FullProductCategoryResponse;
import com.example.mmoapi.beans.response.productCategory.ProductCategoryResponse;
import com.example.mmoapi.entity.ProductCategory;
import com.example.mmoapi.exception.ResourceNotFoundException;
import com.example.mmoapi.mapper.ProductCategoryMapper;
import com.example.mmoapi.repository.ProductCategoryRepository;
import com.example.mmoapi.service.ProductCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductCategoryServiceImpl implements ProductCategoryService {
    private final ProductCategoryRepository productCategoryRepository;
    private final ProductCategoryMapper productCategoryMapper;
    private final Cloudinary cloudinary;

    @Override
    public List<ProductCategoryResponse> getAllProductCategories() {
        List<ProductCategory> productCategories = productCategoryRepository.findAll();

        return productCategories.stream()
                .map(productCategoryMapper::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<FullProductCategoryResponse> getAllFullProductCategories() {
        List<ProductCategory> productCategories = productCategoryRepository.findAll();

        return productCategories.stream()
                .map(productCategoryMapper::convertToFullResponse)
                .collect(Collectors.toList());
    }

    @Override
    public FullProductCategoryResponse getProductCategoryById(Integer id) {
        ProductCategory productCategory = productCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product category with id " + id + " not found"));

        return productCategoryMapper.convertToFullResponse(productCategory);
    }

    @Override
    public void addProductCategory(ProductCategoryRequest productCategoryRequest) {
        ProductCategory productCategory = new ProductCategory();
        productCategoryMapper.convertToRequest(productCategory, productCategoryRequest, cloudinary);
        productCategoryRepository.save(productCategory);
    }

    @Override
    public void updateProductCategory(Integer id, ProductCategoryRequest productCategoryRequest) {
        ProductCategory productCategory = productCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product category with id " + id + " not found"));

        productCategoryMapper.convertToRequest(productCategory, productCategoryRequest, cloudinary);
        productCategoryRepository.save(productCategory);
    }

    @Override
    public void deleteProductCategory(Integer id) {
        productCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product category with id " + id + " not found"));
        productCategoryRepository.deleteById(id);
    }
}
