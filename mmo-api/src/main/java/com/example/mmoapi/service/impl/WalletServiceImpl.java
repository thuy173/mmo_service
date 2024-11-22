package com.example.mmoapi.service.impl;

import com.example.mmoapi.beans.response.WalletResponse;
import com.example.mmoapi.entity.User;
import com.example.mmoapi.entity.Wallet;
import com.example.mmoapi.enums.TransactionType;
import com.example.mmoapi.exception.ResourceNotFoundException;
import com.example.mmoapi.mapper.WalletMapper;
import com.example.mmoapi.repository.UserRepository;
import com.example.mmoapi.repository.WalletRepository;
import com.example.mmoapi.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final WalletMapper walletMapper;

    @Override
    public WalletResponse getWallet(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Wallet wallet = walletRepository.findByUser(user);
        return walletMapper.convertToResponse(wallet);
    }

    @Override
    public void updateWallet(String username, double amount, TransactionType transactionType) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Wallet wallet = walletRepository.findByUser(user);
        if (transactionType.equals(TransactionType.DEPOSIT)) {
            wallet.setBalance(wallet.getBalance() + amount);
        } else if (transactionType.equals(TransactionType.WITHDRAW)) {
            wallet.setBalance(wallet.getBalance() - amount);
        }
        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);
    }
}
