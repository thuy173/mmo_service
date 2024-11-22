package com.example.mmoapi.mapper;

import com.example.mmoapi.beans.request.transaction.WithdrawRequest;
import com.example.mmoapi.beans.request.transaction.DepositRequest;
import com.example.mmoapi.beans.response.transaction.TransactionDetailRes;
import com.example.mmoapi.beans.response.transaction.TransactionResponse;
import com.example.mmoapi.beans.response.user.ShortUserResponse;
import com.example.mmoapi.entity.PaymentMethod;
import com.example.mmoapi.entity.Transaction;
import com.example.mmoapi.entity.User;
import com.example.mmoapi.entity.Wallet;
import com.example.mmoapi.enums.TransactionType;
import com.example.mmoapi.exception.ResourceNotFoundException;
import com.example.mmoapi.repository.PaymentMethodRepository;
import com.example.mmoapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class TransactionMapper {
    private final PaymentMethodRepository paymentMethodRepository;
    private final UserRepository userRepository;

    public void convertToDepositRequest(Transaction transaction, DepositRequest depositRequest, User user, Wallet wallet) {
        transaction.setUserId(user.getId());
        PaymentMethod paymentMethod = paymentMethodRepository.findById(depositRequest.getPaymentMethodId())
                .orElseThrow(() -> new ResourceNotFoundException("PaymentMethod not found"));
        transaction.setPaymentMethodId(paymentMethod.getId());
        transaction.setAmount(depositRequest.getAmount());
        transaction.setTransactionType(TransactionType.DEPOSIT);
        transaction.setBalanceBefore(wallet.getBalance());
        transaction.setBalanceAfter(wallet.getBalance() + depositRequest.getAmount());
        transaction.setCreatedAt(LocalDateTime.now());
    }

    public void convertToWithdrawRequest(Transaction transaction, WithdrawRequest withdrawRequest, User user, Wallet wallet) {
        transaction.setUserId(user.getId());
        transaction.setPaymentMethodId(null);
        transaction.setAmount(withdrawRequest.getAmount());
        transaction.setTransactionType(TransactionType.WITHDRAW);
        transaction.setBalanceBefore(wallet.getBalance());
        transaction.setBalanceAfter(wallet.getBalance() - withdrawRequest.getAmount());
        transaction.setCreatedAt(LocalDateTime.now());
    }

    public TransactionResponse convertToResponse(Transaction transaction) {
        TransactionResponse transactionResponse = new TransactionResponse();
        transactionResponse.setId(transaction.getId());
        transactionResponse.setAmount(transaction.getAmount());
        transactionResponse.setTransactionType(transaction.getTransactionType());
        transactionResponse.setBalanceBefore(transaction.getBalanceBefore());
        transactionResponse.setBalanceAfter(transaction.getBalanceAfter());
        transactionResponse.setReason(transaction.getReason());
        transactionResponse.setCreatedAt(transaction.getCreatedAt());
        return transactionResponse;
    }

    public TransactionDetailRes convertToDetailResponse(Transaction transaction, String username) {
        User user = userRepository.findById(transaction.getUserId()).orElse(null);
        ShortUserResponse shortUserResponse = new ShortUserResponse();
        if(user != null) {
            shortUserResponse.setId(user.getId());
            shortUserResponse.setFullName(user.getFullName());
            shortUserResponse.setUsername(user.getUsername());
            shortUserResponse.setAvatar(user.getAvatar());
        }
        return getTransactionDetailRes(transaction, shortUserResponse);
    }

    private static TransactionDetailRes getTransactionDetailRes(Transaction transaction, ShortUserResponse shortUserResponse) {
        TransactionDetailRes transactionDetailRes = new TransactionDetailRes();
        transactionDetailRes.setId(transaction.getId());
        transactionDetailRes.setUser(shortUserResponse);
        transactionDetailRes.setAmount(transaction.getAmount());
        transactionDetailRes.setTransactionType(transaction.getTransactionType());
        transactionDetailRes.setBalanceBefore(transaction.getBalanceBefore());
        transactionDetailRes.setBalanceAfter(transaction.getBalanceAfter());
        transactionDetailRes.setReason(transaction.getReason());
        transactionDetailRes.setCreatedAt(transaction.getCreatedAt());
        return transactionDetailRes;
    }
}
