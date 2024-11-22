package com.example.mmoapi.beans.response;

import com.example.mmoapi.beans.response.product.TinyProductRes;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    private String id;
    private Long userId;
    private TinyProductRes product;
    private String orderCode;
    private int quantity;
    private double amount;
    private String accounts;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isDeleted;
}