package com.example.mmoapi.controller.site;

import com.example.mmoapi.beans.request.transaction.DepositRequest;
import com.example.mmoapi.beans.response.transaction.TransactionResponse;
import com.example.mmoapi.service.TransactionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Tag(name = "Transactions")
public class TransactionController {
    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<Page<TransactionResponse>> getAllTransactions(
            @RequestParam(required = false) String reason,
            @RequestParam(required = false) LocalDateTime createdAt,
            @RequestParam(required = false) Integer daysRange,
            @RequestParam(required = false, defaultValue = "0") int pageNumber,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "id") String sortField,
            @RequestParam(required = false, defaultValue = "ASC") Sort.Direction sortDirection
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Page<TransactionResponse> transactions = transactionService.getAllTransactions(
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

    @PostMapping("/top-up")
    public ResponseEntity<Void> createTopUp(@RequestBody DepositRequest topUpRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        transactionService.deposit(username, topUpRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}
