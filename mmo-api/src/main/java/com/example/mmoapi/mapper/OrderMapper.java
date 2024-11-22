package com.example.mmoapi.mapper;

import com.example.mmoapi.beans.request.OrderRequest;
import com.example.mmoapi.beans.response.OrderResponse;
import com.example.mmoapi.beans.response.product.TinyProductRes;
import com.example.mmoapi.entity.Coupon;
import com.example.mmoapi.entity.Order;
import com.example.mmoapi.entity.Product;
import com.example.mmoapi.entity.User;
import com.example.mmoapi.exception.ResourceNotFoundException;
import com.example.mmoapi.repository.CouponRepository;
import com.example.mmoapi.repository.ProductRepository;
import com.example.mmoapi.service.AccountService;
import com.example.mmoapi.utils.UniqueStringGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class OrderMapper {
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;
    private final AccountService accountService;

    public void convertToRequest(Order order, OrderRequest orderRequest, User user) {
        Product product = productRepository.findById(orderRequest.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        Coupon coupon = couponRepository.findById(orderRequest.getCouponId())
                .orElse(null);

        if (order.getOrderCode() == null || order.getOrderCode().isEmpty()) {
            order.setOrderCode(UniqueStringGenerator.generateUniqueString(10));
        }
        order.setUserId(user.getId());
        order.setProductId(product.getId());
        order.setCouponId(coupon != null ? coupon.getId() : null);
        order.setQuantity(orderRequest.getQuantity());
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        order.setIsDeleted(false);
    }

    public OrderResponse convertToResponse(Order order, boolean isAdmin) {
        Product product = productRepository.findById(order.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        OrderResponse orderResponse = new OrderResponse();
        orderResponse.setId(order.getId());
        orderResponse.setUserId(order.getUserId());
        TinyProductRes tinyProductRes = new TinyProductRes(
                product.getId(),
                product.getName(),
                product.getProductDetail().getDetailDescription()
        );
        orderResponse.setProduct(tinyProductRes);
        orderResponse.setQuantity(order.getQuantity());
        orderResponse.setAmount(product.getSellPrice() * order.getQuantity());
        if (!order.getIsDeleted() || isAdmin) {
            orderResponse.setAccounts(accountService.getAllSoldAccountByOrderId(order.getId()));
        }
        orderResponse.setOrderCode(order.getOrderCode() );
        orderResponse.setCreatedAt(order.getCreatedAt());
        orderResponse.setUpdatedAt(order.getUpdatedAt());
        orderResponse.setIsDeleted(order.getIsDeleted());
        return orderResponse;
    }
}
