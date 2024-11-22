package com.example.mmoapi.beans.response.coupon;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShortCouponRes {
    private Long id;
    private String couponCode;
    private double discount;
    private double minOrderAmount;
    private double maxOrderAmount;
}
