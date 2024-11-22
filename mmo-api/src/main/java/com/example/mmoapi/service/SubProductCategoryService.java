package com.example.mmoapi.service;

import com.example.mmoapi.beans.request.SubProductCategoryRequest;
import com.example.mmoapi.beans.response.productCategory.SubProductCategoryResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface SubProductCategoryService {
    List<SubProductCategoryResponse> getAllSubProductCategories();
    void addSubProductCategory(SubProductCategoryRequest subProductCategoryRequest);
    void updateSubProductCategory(Integer id, SubProductCategoryRequest subProductCategoryRequest);
    void deleteSubProductCategory(Integer id);
}
