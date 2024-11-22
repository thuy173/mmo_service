package com.example.mmoapi.controller.admin;

import com.example.mmoapi.beans.request.ProductCouponRequest;
import com.example.mmoapi.beans.response.ProductCouponResponse;
import com.example.mmoapi.service.ProductCouponService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/product-coupons")
@RequiredArgsConstructor
@Tag(name = "AdminProductCoupons")
public class AdminProductCouponController {
    private final ProductCouponService productCouponService;

    @GetMapping
    public ResponseEntity<Page<ProductCouponResponse>> getAllProductCoupons(
            @RequestParam(required = false, defaultValue = "0") int pageNumber,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "id") String sortField,
            @RequestParam(required = false, defaultValue = "ASC") Sort.Direction sortDirection
    ) {
        Page<ProductCouponResponse> productCoupons = productCouponService.getAllProductCoupons(pageNumber, pageSize, sortField, sortDirection);

        return ResponseEntity.ok(productCoupons);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductCouponResponse> getProductCouponById(@PathVariable Long id) {
        return ResponseEntity.ok(productCouponService.getProductCouponById(id));
    }

    @PostMapping
    public ResponseEntity<Void> createProductCoupon(@RequestBody ProductCouponRequest productCouponRequest) {
        productCouponService.addProductCoupon(productCouponRequest);
        return  ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateProductCoupon(@PathVariable Long id, @RequestBody ProductCouponRequest productCouponRequest) {
        productCouponService.updateProductCoupon(id, productCouponRequest);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductCoupon(@PathVariable Long id) {
        productCouponService.deleteProductCoupon(id);
        return ResponseEntity.noContent().build();
    }
}
