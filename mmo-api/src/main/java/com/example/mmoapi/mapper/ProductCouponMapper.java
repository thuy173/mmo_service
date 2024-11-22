package com.example.mmoapi.mapper;

import com.example.mmoapi.beans.request.ProductCouponRequest;
import com.example.mmoapi.beans.response.ProductCouponResponse;
import com.example.mmoapi.entity.Coupon;
import com.example.mmoapi.entity.Product;
import com.example.mmoapi.entity.ProductCoupon;
import com.example.mmoapi.exception.ResourceNotFoundException;
import com.example.mmoapi.repository.CouponRepository;
import com.example.mmoapi.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductCouponMapper {
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;

    public void convertToRequest(ProductCoupon productCoupon, ProductCouponRequest productCouponRequest){
        Product product = productRepository.findById(productCouponRequest.getProductId())
                .orElseThrow(()-> new ResourceNotFoundException("Product not found"));
        Coupon coupon = couponRepository.findById(productCouponRequest.getCouponId())
                .orElseThrow(()-> new ResourceNotFoundException("Coupon not found"));

        productCoupon.setProduct(product);
        productCoupon.setCoupon(coupon);
    }

    public ProductCouponResponse convertToResponse(ProductCoupon productCoupon){
        ProductCouponResponse productCouponResponse = new ProductCouponResponse();
        productCouponResponse.setId(productCoupon.getId());
        productCouponResponse.setProductId(productCoupon.getProduct().getId());
        productCouponResponse.setCouponId(productCoupon.getCoupon().getId());
        return productCouponResponse;
    }
}
