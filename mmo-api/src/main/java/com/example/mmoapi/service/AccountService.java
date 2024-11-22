package com.example.mmoapi.service;

import com.example.mmoapi.beans.request.account.AccountFileRequest;
import com.example.mmoapi.beans.request.account.AccountTextRequest;
import com.example.mmoapi.beans.response.account.AccountAvailableRes;
import com.example.mmoapi.beans.response.account.AccountSoldRes;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public interface AccountService {
    Page<AccountAvailableRes> getAllAvailableAccount(
            String username,
            String productCode,
            LocalDateTime createdAt,
            Integer daysRange,
            int pageNumber,
            int pageSize,
            String sortField,
            Sort.Direction sortDirection
    );

    Page<AccountAvailableRes> getAllAvailableAccountByProductId(
            Long productId,
            String username,
            LocalDateTime createdAt,
            Integer daysRange,
            int pageNumber,
            int pageSize,
            String sortField,
            Sort.Direction sortDirection
    );

    Page<AccountSoldRes> getAllSoldAccount(
            String username,
            String productCode,
            String orderCode,
            LocalDateTime createdAt,
            Integer daysRange,
            int pageNumber,
            int pageSize,
            String sortField,
            Sort.Direction sortDirection
    );

    String getAllSoldAccountByOrderId(String orderId);
    long countAccountByProductIdAndIsSold(Long product, Boolean isSold);

    void addManyAccount(AccountTextRequest accountTextRequest);

    void addAccountFile(AccountFileRequest accountFileRequest);

    void updateAccountsToSold(Long productId, int quantity, String orderId);
    void deleteAccount(String id);
    void deleteAllAccountByProductId(Long productId);
}
