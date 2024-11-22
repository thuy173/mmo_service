package com.example.mmoapi.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private Long userId;
    private Long productId;
    private Long couponId;

    @Indexed(unique = true)
    private String orderCode;

    private int quantity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isDeleted;
}
