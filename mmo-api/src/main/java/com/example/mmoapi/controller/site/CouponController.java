package com.example.mmoapi.controller.site;

import com.example.mmoapi.beans.response.coupon.ShortCouponRes;
import com.example.mmoapi.service.CouponService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
@Tag(name = "Coupons")
public class CouponController {
    private final CouponService couponService;

    @GetMapping("/search")
    public ResponseEntity<ShortCouponRes> searchCouponByProductIdAndCode(@RequestParam Long productId, @RequestParam String code) {
        return ResponseEntity.ok(couponService.getCouponByProductIdAndCode(productId, code));
    }
}
