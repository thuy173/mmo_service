package com.example.mmoapi.service;

import com.example.mmoapi.beans.response.WalletResponse;
import com.example.mmoapi.enums.TransactionType;
import org.springframework.stereotype.Service;

@Service
public interface WalletService {
    WalletResponse getWallet(String username);
    void updateWallet(String username, double amount, TransactionType transactionType);
}
