package com.example.mmoapi.beans.response.coupon;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CouponResponse {
    private Long id;
    private String couponCode;
    private long quantity;
    private double discount;
    private boolean isApplyAll;
    private double minOrderAmount;
    private double maxOrderAmount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
