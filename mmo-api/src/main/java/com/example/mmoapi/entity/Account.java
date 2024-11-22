package com.example.mmoapi.entity;

import jakarta.persistence.Id;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "accounts")
public class Account {
    @Id
    private String id;
    private Long productId;
    private String username;
    private String password;
    private Boolean isSold;
    private String orderId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
