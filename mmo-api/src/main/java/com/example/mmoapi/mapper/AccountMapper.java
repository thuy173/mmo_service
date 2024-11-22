package com.example.mmoapi.mapper;

import com.example.mmoapi.beans.request.account.AccountTextRequest;
import com.example.mmoapi.beans.response.account.AccountAvailableRes;
import com.example.mmoapi.beans.response.account.AccountSoldRes;
import com.example.mmoapi.entity.Account;
import com.example.mmoapi.entity.Order;
import com.example.mmoapi.entity.Product;
import com.example.mmoapi.exception.ResourceNotFoundException;
import com.example.mmoapi.repository.OrderRepository;
import com.example.mmoapi.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AccountMapper {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public void convertToRequest(Account account, AccountTextRequest accountTextRequest) {
        List<String> accountParts = Arrays.asList(accountTextRequest.getAccount().split("\\|"));
        if (accountParts.size() == 1) {
            account.setUsername(accountParts.get(0));
        } else {
            account.setUsername(accountParts.get(0));
            account.setPassword(accountParts.get(1));
        }

        account.setProductId(accountTextRequest.getProductId());
        account.setCreatedAt(LocalDateTime.now());
        account.setUpdatedAt(LocalDateTime.now());
        account.setIsSold(false);
    }

    public AccountAvailableRes convertToAvailableRes(Account account) {
        AccountAvailableRes accountAvailableRes = new AccountAvailableRes();
        accountAvailableRes.setId(account.getId());
        accountAvailableRes.setAccount(account.getUsername() + "|" + account.getPassword());
        Product product = productRepository.findById(account.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        accountAvailableRes.setProductCode(product.getProductCode());
        accountAvailableRes.setCreatedAt(account.getCreatedAt());
        accountAvailableRes.setUpdatedAt(account.getUpdatedAt());
        return accountAvailableRes;
    }

    public AccountSoldRes convertToSoldRes(Account account) {
        AccountSoldRes accountSoldRes = new AccountSoldRes();
        accountSoldRes.setId(account.getId());
        accountSoldRes.setAccount(account.getUsername() + "|" + account.getPassword());
        Product product = productRepository.findById(account.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        accountSoldRes.setProductCode(product.getProductCode());
        Order order = orderRepository.findById(account.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        accountSoldRes.setOrderCode(order.getOrderCode());
        accountSoldRes.setCreatedAt(account.getCreatedAt());
        accountSoldRes.setUpdatedAt(account.getUpdatedAt());
        return accountSoldRes;
    }
}
