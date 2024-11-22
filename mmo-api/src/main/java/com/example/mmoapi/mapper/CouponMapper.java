package com.example.mmoapi.mapper;

import com.example.mmoapi.beans.request.CouponRequest;
import com.example.mmoapi.beans.response.coupon.CouponResponse;
import com.example.mmoapi.beans.response.coupon.ShortCouponRes;
import com.example.mmoapi.entity.Coupon;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class CouponMapper {
    public void convertToRequest(Coupon coupon, CouponRequest couponRequest){
        coupon.setQuantity(couponRequest.getQuantity());
        coupon.setDiscount(couponRequest.getDiscount());
        coupon.setApplyAll(couponRequest.isApplyAll());
        coupon.setMinOrderAmount(couponRequest.getMinOrderAmount());
        coupon.setMaxOrderAmount(couponRequest.getMaxOrderAmount());
        coupon.setCreatedAt(LocalDateTime.now());
        coupon.setUpdatedAt(LocalDateTime.now());
    }

    public CouponResponse convertToResponse(Coupon coupon){
        CouponResponse couponResponse = new CouponResponse();
        couponResponse.setId(coupon.getId());
        couponResponse.setCouponCode(coupon.getCouponCode());
        couponResponse.setQuantity(coupon.getQuantity());
        couponResponse.setDiscount(coupon.getDiscount());
        couponResponse.setApplyAll(coupon.isApplyAll());
        couponResponse.setMinOrderAmount(coupon.getMinOrderAmount());
        couponResponse.setMaxOrderAmount(coupon.getMaxOrderAmount());
        couponResponse.setCreatedAt(coupon.getCreatedAt());
        couponResponse.setUpdatedAt(coupon.getUpdatedAt());
        return couponResponse;
    }

    public ShortCouponRes convertToShortResponse(Coupon coupon){
        ShortCouponRes shortCouponRes = new ShortCouponRes();
        shortCouponRes.setId(coupon.getId());
        shortCouponRes.setCouponCode(coupon.getCouponCode());
        shortCouponRes.setDiscount(coupon.getDiscount());
        shortCouponRes.setMinOrderAmount(coupon.getMinOrderAmount());
        shortCouponRes.setMaxOrderAmount(coupon.getMaxOrderAmount());
        return shortCouponRes;
    }
}
