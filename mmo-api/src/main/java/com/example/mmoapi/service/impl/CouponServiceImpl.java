package com.example.mmoapi.service.impl;

import com.example.mmoapi.beans.request.CouponRequest;
import com.example.mmoapi.beans.response.coupon.CouponResponse;
import com.example.mmoapi.beans.response.coupon.ShortCouponRes;
import com.example.mmoapi.entity.Coupon;
import com.example.mmoapi.entity.ProductCoupon;
import com.example.mmoapi.exception.ResourceNotFoundException;
import com.example.mmoapi.mapper.CouponMapper;
import com.example.mmoapi.repository.CouponRepository;
import com.example.mmoapi.repository.ProductCouponRepository;
import com.example.mmoapi.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {
    private final CouponRepository couponRepository;
    private final CouponMapper couponMapper;
    private final ProductCouponRepository productCouponRepository;

    @Override
    public Page<CouponResponse> getAllCoupons(int pageNumber, int pageSize, String sortField, Sort.Direction sortDirection) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortDirection, sortField));
        Page<Coupon> coupons = couponRepository.findAll(pageable);

        return coupons.map(couponMapper::convertToResponse);
    }

    @Override
    public CouponResponse getCouponById(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon with id " + id + " not found"));

        return couponMapper.convertToResponse(coupon);
    }

    @Override
    public ShortCouponRes getCouponByProductIdAndCode(Long productId, String code) {
        Coupon coupon = couponRepository.findByCouponCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon with code " + code + " not found"));
        if (coupon.getQuantity() <= 0) {
            throw new ResourceNotFoundException("Coupon with code " + code + " has no quantity");
        }

        if (coupon.isApplyAll()) {
            return couponMapper.convertToShortResponse(coupon);
        } else {
            ProductCoupon productCoupon = productCouponRepository.findByProductIdAndCouponId(productId, coupon.getId());
            if (productCoupon != null) {
                return couponMapper.convertToShortResponse(coupon);
            }
            throw new ResourceNotFoundException("Coupon with code " + code + " not be applied for this product");
        }
    }

    @Override
    public void addCoupon(CouponRequest couponRequest) {
        Coupon coupon = new Coupon();
        couponMapper.convertToRequest(coupon, couponRequest);
        couponRepository.save(coupon);
    }

    @Override
    public void updateCoupon(Long id, CouponRequest couponRequest) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon with id " + id + " not found"));

        couponMapper.convertToRequest(coupon, couponRequest);
        couponRepository.save(coupon);
    }

    @Override
    public void updateCouponQuantity(Long id, Integer quantity) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon with id " + id + " not found"));

        coupon.setQuantity(coupon.getQuantity() - quantity);
        couponRepository.save(coupon);
    }

    @Override
    public void deleteCoupon(Long id) {
        couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon with id " + id + " not found"));
        couponRepository.deleteById(id);
    }
}
