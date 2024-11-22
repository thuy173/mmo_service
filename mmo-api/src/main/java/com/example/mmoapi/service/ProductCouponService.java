package com.example.mmoapi.service;

import com.example.mmoapi.beans.request.ProductCouponRequest;
import com.example.mmoapi.beans.response.ProductCouponResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public interface ProductCouponService {
    Page<ProductCouponResponse> getAllProductCoupons(int pageNumber, int pageSize, String sortField, Sort.Direction sortDirection);
    ProductCouponResponse getProductCouponById(Long id);
    void addProductCoupon(ProductCouponRequest productCouponRequest);
    void updateProductCoupon(Long id, ProductCouponRequest productCouponRequest);
    void deleteProductCoupon(Long id);
}
