package com.example.mmoapi.service.impl;

import com.example.mmoapi.beans.request.transaction.WithdrawRequest;
import com.example.mmoapi.beans.request.transaction.DepositRequest;
import com.example.mmoapi.beans.response.transaction.TransactionDetailRes;
import com.example.mmoapi.beans.response.transaction.TransactionResponse;
import com.example.mmoapi.entity.Transaction;
import com.example.mmoapi.entity.User;
import com.example.mmoapi.entity.Wallet;
import com.example.mmoapi.enums.TransactionType;
import com.example.mmoapi.exception.ResourceNotFoundException;
import com.example.mmoapi.mapper.TransactionMapper;
import com.example.mmoapi.repository.TransactionRepository;
import com.example.mmoapi.repository.UserRepository;
import com.example.mmoapi.repository.WalletRepository;
import com.example.mmoapi.service.TransactionService;
import com.example.mmoapi.service.WalletService;
import com.example.mmoapi.specification.TransactionCriteria;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final UserRepository userRepository;
    private final TransactionMapper transactionMapper;
    private final TransactionRepository transactionRepository;
    private final WalletService walletService;
    private final WalletRepository walletRepository;
    private final MongoTemplate mongoTemplate;

    @Override
    public Page<TransactionDetailRes> getAllDetailTransactions(
            String username,
            String reason,
            LocalDateTime createdAt,
            Integer daysRange,
            int pageNumber,
            int pageSize,
            String sortField,
            Sort.Direction sortDirection
    ) {
        Long userId = null;
        if (username != null) {
            User user = userRepository.findByUsername(username).orElse(null);
            userId = (user != null) ? user.getId() : 0;
        }
        Query query = TransactionCriteria
                .getTransactionByCriteria(userId, reason, createdAt, daysRange);
        long totalElements = mongoTemplate.count(query, Transaction.class);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortDirection, sortField));
        query.with(pageable);
        List<Transaction> transactions = mongoTemplate.find(query, Transaction.class);
        return new PageImpl<>(transactions, pageable, totalElements)
                .map((transaction) -> transactionMapper.convertToDetailResponse(transaction, username));
    }

    @Override
    public Page<TransactionResponse> getAllTransactions(
            String username,
            String reason,
            LocalDateTime createdAt,
            Integer daysRange,
            int pageNumber,
            int pageSize,
            String sortField,
            Sort.Direction sortDirection
    ) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Query query = TransactionCriteria
                .getTransactionByCriteria(user.getId(), reason, createdAt, daysRange);
        long totalElements = mongoTemplate.count(query, Transaction.class);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortDirection, sortField));
        query.with(pageable);
        List<Transaction> transactions = mongoTemplate.find(query, Transaction.class);
        return new PageImpl<>(transactions, pageable, totalElements)
                .map(transactionMapper::convertToResponse);
    }

    @Override
    public void deposit(String username, DepositRequest depositRequest) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Wallet wallet = walletRepository.findByUser(user);
        Transaction transaction = new Transaction();
        transactionMapper.convertToDepositRequest(transaction, depositRequest, user, wallet);
        transactionRepository.save(transaction);
        walletService.updateWallet(username, depositRequest.getAmount(), TransactionType.DEPOSIT);
    }

    @Override
    public String withdraw(String username, WithdrawRequest withdrawRequest) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Wallet wallet = walletRepository.findByUser(user);
        Transaction transaction = new Transaction();
        transactionMapper.convertToWithdrawRequest(transaction, withdrawRequest, user, wallet);
        transactionRepository.save(transaction);
        walletService.updateWallet(username, withdrawRequest.getAmount(), TransactionType.WITHDRAW);
        return transaction.getId();
    }

    @Override
    public void updateReason(String id, String reason) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        transaction.setReason(reason);
        transactionRepository.save(transaction);
    }

    @Override
    public Double getTotalAmountPaidToday() {
        LocalDate today = LocalDate.now();
        Date startOfDay = Date.from(today.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endOfDay = Date.from(today.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("transactionDate").gte(startOfDay).lt(endOfDay)),
                Aggregation.group().sum("amount").as("totalAmount")
        );

        AggregationResults<Double> result = mongoTemplate.aggregate(aggregation, "transactions", Double.class);

        return result.getUniqueMappedResult() != null ? result.getUniqueMappedResult() : 0.0;
    }

    @Override
    public Map<LocalDate, Double> getTotalAmountByDayInMonth(int month, int year) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        LocalDateTime startOfMonth = startDate.atStartOfDay();
        LocalDateTime endOfMonth = endDate.atTime(23, 59, 59);

        List<Transaction> transactions = transactionRepository.findTransactionsInDateRange(startOfMonth, endOfMonth);

        Map<LocalDate, Double> totalAmountByDay = new HashMap<>();
        for (Transaction transaction : transactions) {
            LocalDate transactionDate = transaction.getCreatedAt().toLocalDate();
            totalAmountByDay.merge(transactionDate, transaction.getAmount(), Double::sum);
        }

        return totalAmountByDay;
    }

    @Override
    public Map<LocalDate, Double> getTotalDepositByDayInMonth(int month, int year) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        LocalDateTime startOfMonth = startDate.atStartOfDay();
        LocalDateTime endOfMonth = endDate.atTime(23, 59, 59);

        List<Transaction> transactions = transactionRepository
                .findTransactionsInDateRangeAndType(startOfMonth, endOfMonth, TransactionType.DEPOSIT);

        Map<LocalDate, Double> totalDepositByDay = new HashMap<>();
        for (Transaction transaction : transactions) {
            LocalDate transactionDate = transaction.getCreatedAt().toLocalDate();
            totalDepositByDay.merge(transactionDate, transaction.getAmount(), Double::sum);
        }

        return totalDepositByDay;
    }

}
