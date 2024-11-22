package com.example.mmoapi.mapper;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.mmoapi.beans.request.ProductCategoryRequest;
import com.example.mmoapi.beans.response.productCategory.FullProductCategoryResponse;
import com.example.mmoapi.beans.response.productCategory.ProductCategoryResponse;
import com.example.mmoapi.beans.response.productCategory.SubProductCategoryResponse;
import com.example.mmoapi.entity.ProductCategory;
import com.example.mmoapi.entity.SubProductCategory;
import com.example.mmoapi.repository.SubProductCategoryRepository;
import com.example.mmoapi.service.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductCategoryMapper {
    private final SubProductCategoryRepository subProductCategoryRepository;
    private final SubProductCategoryMapper subProductCategoryMapper;
    private final UploadService uploadService;

    public void convertToRequest(ProductCategory productCategory, ProductCategoryRequest productCategoryRequest, Cloudinary cloudinary){
        productCategory.setName(productCategoryRequest.getName());

        productCategory.setDescription(productCategoryRequest.getDescription());
        productCategory.setActive(productCategoryRequest.getIsActive());
        productCategory.setOrderNum(productCategoryRequest.getOrderNum());

        if (productCategoryRequest.getIcon() != null && !productCategoryRequest.getIcon().isEmpty()) {
            String uploadUrl = uploadService.uploadFile(productCategoryRequest.getIcon());
            productCategory.setIconUrl(uploadUrl);
        } else {
            productCategory.setIconUrl(productCategory.getIconUrl());
        }

    }

    public ProductCategoryResponse convertToResponse(ProductCategory productCategory){
        ProductCategoryResponse productCategoryResponse = new ProductCategoryResponse();
        productCategoryResponse.setId(productCategory.getId());
        productCategoryResponse.setName(productCategory.getName());
        productCategoryResponse.setIcon(productCategory.getIconUrl());
        productCategoryResponse.setDescription(productCategory.getDescription());
        productCategoryResponse.setActive(productCategory.isActive());
        productCategoryResponse.setOrderNum(productCategory.getOrderNum());
        return productCategoryResponse;
    }

    public FullProductCategoryResponse convertToFullResponse(ProductCategory productCategory){
        FullProductCategoryResponse fullProductCategoryResponse = new FullProductCategoryResponse();
        fullProductCategoryResponse.setId(productCategory.getId());
        fullProductCategoryResponse.setName(productCategory.getName());
        fullProductCategoryResponse.setIcon(productCategory.getIconUrl());
        fullProductCategoryResponse.setDescription(productCategory.getDescription());
        fullProductCategoryResponse.setActive(productCategory.isActive());
        fullProductCategoryResponse.setOrderNum(productCategory.getOrderNum());
        List<SubProductCategory> subProductCategories = subProductCategoryRepository.findAllByProductCategory(productCategory);
        List<SubProductCategoryResponse> subProductCategoryResponses = subProductCategories.stream()
                .map(subProductCategoryMapper::convertToResponse)
                .collect(Collectors.toList());

        fullProductCategoryResponse.setSubProductCategories(subProductCategoryResponses);
        return fullProductCategoryResponse;
    }
}
