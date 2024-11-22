package com.example.mmoapi.service;

import com.example.mmoapi.beans.request.CouponRequest;
import com.example.mmoapi.beans.response.coupon.CouponResponse;
import com.example.mmoapi.beans.response.coupon.ShortCouponRes;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public interface CouponService {
    Page<CouponResponse> getAllCoupons(int pageNumber, int pageSize, String sortField, Sort.Direction sortDirection);
    CouponResponse getCouponById(Long id);
    ShortCouponRes getCouponByProductIdAndCode(Long productId, String code);
    void addCoupon(CouponRequest couponRequest);
    void updateCoupon(Long id, CouponRequest couponRequest);
    void updateCouponQuantity(Long id, Integer quantity);
    void deleteCoupon(Long id);
}
