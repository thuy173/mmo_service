package com.example.mmoapi.service;

import com.example.mmoapi.beans.request.OrderRequest;
import com.example.mmoapi.beans.response.OrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public interface OrderService {
    Page<OrderResponse> getAllOrders(
            String username,
            String orderCode,
            String productCode,
            LocalDateTime createdAt,
            Integer daysRange,
            int pageNumber,
            int pageSize,
            String sortField,
            Sort.Direction sortDirection
    );

    Page<OrderResponse> getAllOrdersByUser(
            String username,
            String orderCode,
            LocalDateTime createdAt,
            Integer daysRange,
            int pageNumber,
            int pageSize,
            String sortField,
            Sort.Direction sortDirection
    );

    long countAllOrders();

    OrderResponse getOrderById(String id);

    OrderResponse addOrder(String username, OrderRequest orderRequest);

    void deleteOrder(String id);

    void deleteManyOrders(List<String> ids);

    double calculateTotalProfit();

    Map<LocalDate, Double> calculateTotalProfitByTime(int month, int year);
}
