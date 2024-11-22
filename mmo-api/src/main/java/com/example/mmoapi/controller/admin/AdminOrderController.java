package com.example.mmoapi.controller.admin;

import com.example.mmoapi.beans.response.OrderResponse;
import com.example.mmoapi.service.OrderService;
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
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@Tag(name = "AdminOrders")
public class AdminOrderController {
    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<Page<OrderResponse>> getAllOrders(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String orderCode,
            @RequestParam(required = false) String productCode,
            @RequestParam(required = false) LocalDateTime createdAt,
            @RequestParam(required = false) Integer daysRange,
            @RequestParam(required = false, defaultValue = "0") int pageNumber,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "id") String sortField,
            @RequestParam(required = false, defaultValue = "ASC") Sort.Direction sortDirection
    ) {
        Page<OrderResponse> orders = orderService.getAllOrders(username, orderCode, productCode, createdAt, daysRange,
                pageNumber, pageSize, sortField, sortDirection);

        return ResponseEntity.ok(orders);
    }
}
