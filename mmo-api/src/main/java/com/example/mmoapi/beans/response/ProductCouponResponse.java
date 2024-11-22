package com.example.mmoapi.beans.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductCouponResponse {
    private Long id;
    private Long productId;
    private Long couponId;
}
