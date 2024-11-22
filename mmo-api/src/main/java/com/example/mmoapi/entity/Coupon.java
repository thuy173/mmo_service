package com.example.mmoapi.entity;

import com.example.mmoapi.utils.UniqueStringGenerator;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "coupons")
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "coupon_code", unique = true, nullable = false)
    private String couponCode;

    private long quantity;
    private double discount;

    @Column(name = "is_apply_all")
    private boolean isApplyAll;

    @Column(name = "min_order_amount")
    private double minOrderAmount;

    @Column(name = "max_order_amount")
    private double maxOrderAmount;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "coupon", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductCoupon> productCouponList;

    @PrePersist
    protected void onCreate() {
        if (couponCode == null || couponCode.isEmpty()) {
            couponCode = UniqueStringGenerator.generateUniqueString(10);
        }
    }

}
