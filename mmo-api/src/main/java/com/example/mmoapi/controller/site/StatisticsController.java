package com.example.mmoapi.controller.site;

import com.example.mmoapi.beans.response.StatisticsResponse;
import com.example.mmoapi.service.OrderService;
import com.example.mmoapi.service.ProductService;
import com.example.mmoapi.service.SubProductCategoryService;
import com.example.mmoapi.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@Tag(name = "Statistics")
public class StatisticsController {
    private final ProductService productService;
    private final OrderService orderService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<StatisticsResponse> getStatistics() {
        StatisticsResponse response = new StatisticsResponse();
        response.setUsers(userService.countUsers());
        response.setProducts(productService.countProducts());
        response.setOrders(orderService.countAllOrders());
        return ResponseEntity.ok(response);
    }
}
