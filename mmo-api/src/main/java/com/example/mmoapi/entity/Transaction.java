package com.example.mmoapi.entity;

import com.example.mmoapi.enums.TransactionType;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "transactions")
public class Transaction {
    @Id
    private String id;
    private Long userId;
    private Integer paymentMethodId;
    private double amount;
    private TransactionType transactionType;
    private double balanceBefore;
    private double balanceAfter;
    private String reason;
    private LocalDateTime createdAt;
}
