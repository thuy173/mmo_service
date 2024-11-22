package com.example.mmoapi.beans.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CouponRequest {
    private long quantity;
    private double discount;
    private boolean isApplyAll;
    private double minOrderAmount;
    private double maxOrderAmount;

}
