package com.example.mmoapi.controller.admin;

import com.example.mmoapi.beans.response.DashBoardResponse;
import com.example.mmoapi.service.OrderService;
import com.example.mmoapi.service.TransactionService;
import com.example.mmoapi.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@Tag(name = "AdminDashboard")
public class AdminDashboardController {
    private final OrderService orderService;
    private final UserService userService;
    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<DashBoardResponse> getDashboard() {
        DashBoardResponse response = new DashBoardResponse();
        response.setUsers(userService.countUsers());
        response.setOrders(orderService.countAllOrders());
        response.setOrdersTotal(transactionService.getTotalAmountPaidToday());
        response.setRevenue(orderService.calculateTotalProfit());
        return ResponseEntity.ok(response);
    }
    @GetMapping("/profit-chart")
    public Map<LocalDate, Double> getProfitChart(@RequestParam int month, @RequestParam int year) {
        return orderService.calculateTotalProfitByTime(month, year);
    }
    @GetMapping("/revenue-chart")
    public Map<LocalDate, Double> getRevenueChart(@RequestParam int month, @RequestParam int year) {
        return transactionService.getTotalAmountByDayInMonth(month, year);
    }
    @GetMapping("/deposit-chart")
    public Map<LocalDate, Double> getTotalDepositChart(@RequestParam int month, @RequestParam int year) {
        return transactionService.getTotalDepositByDayInMonth(month, year);
    }
}
