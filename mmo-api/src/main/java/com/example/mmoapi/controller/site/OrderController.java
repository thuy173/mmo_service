package com.example.mmoapi.controller.site;

import com.example.mmoapi.beans.request.OrderRequest;
import com.example.mmoapi.beans.response.OrderResponse;
import com.example.mmoapi.service.AccountService;
import com.example.mmoapi.service.OrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders")
public class OrderController {
    private final OrderService orderService;
    private final AccountService accountService;

    @GetMapping
    public ResponseEntity<Page<OrderResponse>> getAllOrders(
            @RequestParam(required = false) String orderCode,
            @RequestParam(required = false) LocalDateTime createdAt,
            @RequestParam(required = false) Integer daysRange,
            @RequestParam(required = false, defaultValue = "0") int pageNumber,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "id") String sortField,
            @RequestParam(required = false, defaultValue = "ASC") Sort.Direction sortDirection
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Page<OrderResponse> orderResponses = orderService.getAllOrdersByUser(username, orderCode, createdAt, daysRange,
                pageNumber, pageSize, sortField, sortDirection);

        return ResponseEntity.ok(orderResponses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable String id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/{orderId}/account")
    public ResponseEntity<String> getAccountByOrderId(@PathVariable String orderId) {
        String accounts = accountService.getAllSoldAccountByOrderId(orderId);
        return ResponseEntity.ok(accounts);
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest orderRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        OrderResponse orderResponse = orderService.addOrder(username, orderRequest);
        return ResponseEntity.ok(orderResponse);
    }

    public ResponseEntity<Resource> downloadFile(String fileName) {
        File file = new File(fileName + ".txt");
        InputStreamResource resource = null;
        try {
            resource = new InputStreamResource(new FileInputStream(file));
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName + ".txt")
                .contentType(MediaType.TEXT_PLAIN)
                .contentLength(file.length())
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable String id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/many/{ids}")
    public ResponseEntity<Void> deleteManyOrders(@PathVariable List<String> ids) {
        orderService.deleteManyOrders(ids);
        return ResponseEntity.noContent().build();
    }
}
