package com.example.mmoapi.service;

import com.example.mmoapi.beans.request.ProductCategoryRequest;
import com.example.mmoapi.beans.response.productCategory.FullProductCategoryResponse;
import com.example.mmoapi.beans.response.productCategory.ProductCategoryResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProductCategoryService {

    List<ProductCategoryResponse> getAllProductCategories();

    List<FullProductCategoryResponse> getAllFullProductCategories();

    FullProductCategoryResponse getProductCategoryById(Integer id);

    void addProductCategory(ProductCategoryRequest productCategoryRequest);

    void updateProductCategory(Integer id, ProductCategoryRequest productCategoryRequest);

    void deleteProductCategory(Integer id);

}
