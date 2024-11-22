package com.example.mmoapi.service.impl;

import com.cloudinary.Cloudinary;
import com.example.mmoapi.beans.request.SubProductCategoryRequest;
import com.example.mmoapi.beans.response.productCategory.SubProductCategoryResponse;
import com.example.mmoapi.entity.SubProductCategory;
import com.example.mmoapi.exception.ResourceNotFoundException;
import com.example.mmoapi.mapper.SubProductCategoryMapper;
import com.example.mmoapi.repository.SubProductCategoryRepository;
import com.example.mmoapi.service.SubProductCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubProductCategoryServiceImpl implements SubProductCategoryService {
    private final SubProductCategoryRepository subProductCategoryRepository;
    private final SubProductCategoryMapper subProductCategoryMapper;
    private final Cloudinary cloudinary;

    @Override
    public List<SubProductCategoryResponse> getAllSubProductCategories() {
        List<SubProductCategory> subProductCategories = subProductCategoryRepository.findAll();

        return subProductCategories.stream()
                .map(subProductCategoryMapper::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void addSubProductCategory(SubProductCategoryRequest subProductCategoryRequest) {
        SubProductCategory subProductCategory = new SubProductCategory();
        subProductCategoryMapper.convertToRequest(subProductCategory, subProductCategoryRequest, cloudinary);
        subProductCategoryRepository.save(subProductCategory);
    }

    @Override
    public void updateSubProductCategory(Integer id, SubProductCategoryRequest subProductCategoryRequest) {
        SubProductCategory subProductCategory = subProductCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sub product category with id " + id + " not found"));
        subProductCategoryMapper.convertToRequest(subProductCategory, subProductCategoryRequest, cloudinary);
        subProductCategoryRepository.save(subProductCategory);
    }

    @Override
    public void deleteSubProductCategory(Integer id) {
        subProductCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sub product category with id " + id + " not found"));
        subProductCategoryRepository.deleteById(id);
    }
}
