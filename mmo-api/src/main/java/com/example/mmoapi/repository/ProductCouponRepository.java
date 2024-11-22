package com.example.mmoapi.repository;

import com.example.mmoapi.entity.ProductCoupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductCouponRepository extends JpaRepository<ProductCoupon, Long> {
    ProductCoupon findByProductIdAndCouponId(Long productId, Long couponId);
}
