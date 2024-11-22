package com.example.mmoapi.service.impl;

import com.example.mmoapi.beans.request.ProductCouponRequest;
import com.example.mmoapi.beans.response.ProductCouponResponse;
import com.example.mmoapi.entity.ProductCoupon;
import com.example.mmoapi.exception.ResourceNotFoundException;
import com.example.mmoapi.mapper.ProductCouponMapper;
import com.example.mmoapi.repository.ProductCouponRepository;
import com.example.mmoapi.service.ProductCouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductCouponServiceImpl implements ProductCouponService {
    private final ProductCouponRepository productCouponRepository;
    private final ProductCouponMapper productCouponMapper;

    @Override
    public Page<ProductCouponResponse> getAllProductCoupons(int pageNumber, int pageSize, String sortField, Sort.Direction sortDirection) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortDirection, sortField));
        Page<ProductCoupon> productCoupons = productCouponRepository.findAll(pageable);

        return productCoupons.map(productCouponMapper::convertToResponse);
    }

    @Override
    public ProductCouponResponse getProductCouponById(Long id) {
        ProductCoupon productCoupon = productCouponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product coupon with id " + id + " not found"));

        return productCouponMapper.convertToResponse(productCoupon);
    }

    @Override
    public void addProductCoupon(ProductCouponRequest productCouponRequest) {
        ProductCoupon productCoupon = new ProductCoupon();
        productCouponMapper.convertToRequest(productCoupon, productCouponRequest);
        productCouponRepository.save(productCoupon);
    }

    @Override
    public void updateProductCoupon(Long id, ProductCouponRequest productCouponRequest) {
        ProductCoupon productCoupon = productCouponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product coupon with id " + id + " not found"));

        productCouponMapper.convertToRequest(productCoupon, productCouponRequest);
        productCouponRepository.save(productCoupon);
    }

    @Override
    public void deleteProductCoupon(Long id) {
        productCouponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product coupon with id " + id + " not found"));
        productCouponRepository.deleteById(id);
    }
}
