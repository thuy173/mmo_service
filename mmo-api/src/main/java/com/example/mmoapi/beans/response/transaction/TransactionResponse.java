package com.example.mmoapi.beans.response.transaction;

import com.example.mmoapi.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionResponse {
    private String id;
    private double amount;
    private TransactionType transactionType;
    private double balanceBefore;
    private double balanceAfter;
    private String reason;
    private LocalDateTime createdAt;
}
