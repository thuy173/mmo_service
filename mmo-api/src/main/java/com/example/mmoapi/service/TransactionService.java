package com.example.mmoapi.service;

import com.example.mmoapi.beans.request.transaction.WithdrawRequest;
import com.example.mmoapi.beans.request.transaction.DepositRequest;
import com.example.mmoapi.beans.response.transaction.TransactionDetailRes;
import com.example.mmoapi.beans.response.transaction.TransactionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Service
public interface TransactionService {
    Page<TransactionDetailRes> getAllDetailTransactions(
            String username,
            String reason,
            LocalDateTime createdAt,
            Integer daysRange,
            int pageNumber,
            int pageSize,
            String sortField,
            Sort.Direction sortDirection
    );
    Page<TransactionResponse> getAllTransactions(
            String username,
            String reason,
            LocalDateTime createdAt,
            Integer daysRange,
            int pageNumber,
            int pageSize,
            String sortField,
            Sort.Direction sortDirection
    );
    void deposit(String username, DepositRequest depositRequest);
    String withdraw(String username, WithdrawRequest withdrawRequest);
    void updateReason(String id, String reason);

    Double getTotalAmountPaidToday();

    Map<LocalDate, Double> getTotalAmountByDayInMonth(int month, int year);

    Map<LocalDate, Double> getTotalDepositByDayInMonth(int month, int year);
}
