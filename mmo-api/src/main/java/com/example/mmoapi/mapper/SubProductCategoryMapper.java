package com.example.mmoapi.mapper;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.mmoapi.beans.request.SubProductCategoryRequest;
import com.example.mmoapi.beans.response.productCategory.SubProductCategoryResponse;
import com.example.mmoapi.entity.ProductCategory;
import com.example.mmoapi.entity.SubProductCategory;
import com.example.mmoapi.exception.ResourceNotFoundException;
import com.example.mmoapi.repository.ProductCategoryRepository;
import com.example.mmoapi.service.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class SubProductCategoryMapper {
    private final ProductCategoryRepository productCategoryRepository;
    private final UploadService uploadService;

    public void convertToRequest(SubProductCategory subProductCategory, SubProductCategoryRequest subProductCategoryRequest, Cloudinary cloudinary){
        ProductCategory productCategory = productCategoryRepository.findById(subProductCategoryRequest.getProductCategoryId())
                .orElseThrow(()-> new ResourceNotFoundException("Product category not found"));

        subProductCategory.setProductCategory(productCategory);
        subProductCategory.setName(subProductCategoryRequest.getName());

        if (subProductCategoryRequest.getIcon() != null && !subProductCategoryRequest.getIcon().isEmpty()) {
            String uploadUrl = uploadService.uploadFile(subProductCategoryRequest.getIcon());
            subProductCategory.setIconUrl(uploadUrl);
        } else {
            subProductCategory.setIconUrl(subProductCategory.getIconUrl());
        }

        subProductCategory.setDescription(subProductCategoryRequest.getDescription());
        subProductCategory.setActive(subProductCategoryRequest.isActive());
        subProductCategory.setOrderNum(subProductCategoryRequest.getOrderNum());

    }

    public SubProductCategoryResponse convertToResponse(SubProductCategory subProductCategory){
        SubProductCategoryResponse subProductCategoryResponse = new SubProductCategoryResponse();
        subProductCategoryResponse.setId(subProductCategory.getId());
        subProductCategoryResponse.setProductCategoryId(subProductCategory.getProductCategory().getId());
        subProductCategoryResponse.setName(subProductCategory.getName());
        subProductCategoryResponse.setDescription(subProductCategory.getDescription());
        subProductCategoryResponse.setIcon(subProductCategory.getIconUrl());
        subProductCategoryResponse.setActive(subProductCategory.isActive());
        subProductCategoryResponse.setOrderNum(subProductCategory.getOrderNum());
        return subProductCategoryResponse;
    }
}
