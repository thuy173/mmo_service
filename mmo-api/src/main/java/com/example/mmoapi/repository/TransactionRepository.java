package com.example.mmoapi.repository;

import com.example.mmoapi.entity.Transaction;
import com.example.mmoapi.enums.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {

    Page<Transaction>  findAllByUserId(Long userId, Pageable pageable);

    @Query("{'createdAt': { $gte: ?0, $lte: ?1 }}")
    List<Transaction> findTransactionsInDateRange(LocalDateTime startOfMonth, LocalDateTime endOfMonth);

    @Query("{ 'createdAt': { $gte: ?0, $lte: ?1 }, 'transactionType': ?2 }")
    List<Transaction> findTransactionsInDateRangeAndType(LocalDateTime startDate, LocalDateTime endDate, TransactionType type);

}
