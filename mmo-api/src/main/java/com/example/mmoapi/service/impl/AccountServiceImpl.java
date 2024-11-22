package com.example.mmoapi.service.impl;

import com.example.mmoapi.beans.request.account.AccountFileRequest;
import com.example.mmoapi.beans.request.account.AccountTextRequest;
import com.example.mmoapi.beans.response.account.AccountAvailableRes;
import com.example.mmoapi.beans.response.account.AccountSoldRes;
import com.example.mmoapi.entity.Account;
import com.example.mmoapi.entity.Order;
import com.example.mmoapi.entity.Product;
import com.example.mmoapi.mapper.AccountMapper;
import com.example.mmoapi.repository.AccountRepository;
import com.example.mmoapi.repository.OrderRepository;
import com.example.mmoapi.repository.ProductRepository;
import com.example.mmoapi.service.AccountService;
import com.example.mmoapi.specification.AccountCriteria;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {
    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final MongoTemplate mongoTemplate;

    @Override
    public Page<AccountAvailableRes> getAllAvailableAccount(
            String username,
            String productCode,
            LocalDateTime createdAt,
            Integer daysRange,
            int pageNumber,
            int pageSize,
            String sortField,
            Sort.Direction sortDirection
    ) {
        Long productId = null;
        if (productCode != null) {
            Product product = productRepository.findByProductCode(productCode);
            productId = (product != null) ? product.getId() : 0;
        }
        Query query = AccountCriteria
                .getAccountByCriteria(username, productId, null, false, createdAt, daysRange);
        long totalElements = mongoTemplate.count(query, Account.class);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortDirection, sortField));
        query.with(pageable);
        List<Account> accounts = mongoTemplate.find(query, Account.class);
        return new PageImpl<>(accounts, pageable, totalElements)
                .map(accountMapper::convertToAvailableRes);
    }

    @Override
    public Page<AccountAvailableRes> getAllAvailableAccountByProductId(
            Long productId,
            String username,
            LocalDateTime createdAt,
            Integer daysRange,
            int pageNumber,
            int pageSize,
            String sortField,
            Sort.Direction sortDirection
    ) {
        Query query = AccountCriteria
                .getAccountByCriteria(username, productId, null, false, createdAt, daysRange);
        long totalElements = mongoTemplate.count(query, Account.class);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortDirection, sortField));
        query.with(pageable);
        List<Account> accounts = mongoTemplate.find(query, Account.class);
        return new PageImpl<>(accounts, pageable, totalElements)
                .map(accountMapper::convertToAvailableRes);
    }

    @Override
    public Page<AccountSoldRes> getAllSoldAccount(
            String username,
            String productCode,
            String orderCode,
            LocalDateTime createdAt,
            Integer daysRange,
            int pageNumber,
            int pageSize,
            String sortField,
            Sort.Direction sortDirection
    ) {
        Long productId = null;
        if (productCode != null) {
            Product product = productRepository.findByProductCode(productCode);
            productId = (product != null) ? product.getId() : 0;
        }
        String orderId = null;
        if (orderCode != null) {
            Order order = orderRepository.findByOrderCode(orderCode).orElse(null);
            orderId = (order != null) ? order.getId() : "";
        }
        Query query = AccountCriteria
                .getAccountByCriteria(username, productId, orderId, true, createdAt, daysRange);

        long totalElements = mongoTemplate.count(query, Account.class);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortDirection, sortField));
        query.with(pageable);
        List<Account> accounts = mongoTemplate.find(query, Account.class);
        return new PageImpl<>(accounts, pageable, totalElements)
                .map(accountMapper::convertToSoldRes);
    }

    @Override
    public String getAllSoldAccountByOrderId(String orderId) {
        Query query = AccountCriteria
                .getAccountByCriteria(null, null, orderId, true, null, null);
        List<Account> accounts = mongoTemplate.find(query, Account.class);
        return accounts.stream()
                .map(account -> account.getUsername() + "|" + account.getPassword())
                .collect(Collectors.joining("\n"));
    }

    @Override
    public long countAccountByProductIdAndIsSold(Long product, Boolean isSold) {
        return accountRepository.countByProductIdAndIsSold(product, isSold);
    }

    @Override
    public void addManyAccount(AccountTextRequest accountTextRequest) {
        List<Account> accounts = Arrays.stream(accountTextRequest.getAccount().split("\\r?\\n")).map(accountText -> {
            Account account = new Account();

            AccountTextRequest accountTextReq = new AccountTextRequest(accountTextRequest.getProductId(), accountText);
            accountMapper.convertToRequest(account, accountTextReq);
            return account;
        }).collect(Collectors.toList());

        accountRepository.saveAll(accounts);
    }


    @Override
    public void addAccountFile(AccountFileRequest accountFileRequest) {
        try {
            String fileContent = new String(accountFileRequest.getFile().getBytes());

            List<Account> accounts = Arrays.stream(fileContent.split("\\r?\\n")).map(accountText -> {
                Account account = new Account();

                AccountTextRequest accountTextReq = new AccountTextRequest(accountFileRequest.getProductId(), accountText);
                accountMapper.convertToRequest(account, accountTextReq);
                return account;
            }).collect(Collectors.toList());

            accountRepository.saveAll(accounts);
        } catch (IOException e) {
            throw new RuntimeException("Failed to process the account file", e);
        }
    }

    @Override
    public void updateAccountsToSold(Long productId, int quantity, String orderId) {
        Query query = AccountCriteria
                .getAccountByCriteria(null, productId, null, false, null, null);
        Pageable pageable = PageRequest.of(0, quantity, Sort.by(Sort.Order.asc("createdAt")));
        query.with(pageable);
        List<Account> accounts = mongoTemplate.find(query, Account.class);

        for (Account account : accounts) {
            account.setIsSold(true);
            account.setOrderId(orderId);
            accountRepository.save(account);
        }
    }

    @Override
    public void deleteAccount(String id) {
        accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        accountRepository.deleteById(id);
    }

    @Override
    public void deleteAllAccountByProductId(Long productId) {
        accountRepository.deleteByIsSoldAndProductId(false, productId);
    }
}
