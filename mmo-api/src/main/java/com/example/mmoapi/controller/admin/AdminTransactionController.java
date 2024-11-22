package com.example.mmoapi.controller.admin;

import com.example.mmoapi.beans.response.transaction.TransactionDetailRes;
import com.example.mmoapi.beans.response.transaction.TransactionResponse;
import com.example.mmoapi.service.TransactionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin/transactions")
@RequiredArgsConstructor
@Tag(name = "AdminTransactions")
public class AdminTransactionController {
    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<Page<TransactionDetailRes>> getAllTransactions(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String reason,
            @RequestParam(required = false) LocalDateTime createdAt,
            @RequestParam(required = false) Integer daysRange,
            @RequestParam(required = false, defaultValue = "0") int pageNumber,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "id") String sortField,
            @RequestParam(required = false, defaultValue = "ASC") Sort.Direction sortDirection
    ){
        Page<TransactionDetailRes> transactions = transactionService.getAllDetailTransactions(
                username,
                reason,
                createdAt,
                daysRange,
                pageNumber,
                pageSize,
                sortField,
                sortDirection
        );
        return ResponseEntity.ok(transactions);
    }
}
