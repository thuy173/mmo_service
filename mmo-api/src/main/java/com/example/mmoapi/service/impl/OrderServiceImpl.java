package com.example.mmoapi.service.impl;

import com.example.mmoapi.beans.request.OrderRequest;
import com.example.mmoapi.beans.request.transaction.WithdrawRequest;
import com.example.mmoapi.beans.response.OrderResponse;
import com.example.mmoapi.entity.*;
import com.example.mmoapi.enums.TransactionType;
import com.example.mmoapi.exception.ResourceNotFoundException;
import com.example.mmoapi.mapper.OrderMapper;
import com.example.mmoapi.repository.*;
import com.example.mmoapi.service.*;
import com.example.mmoapi.specification.OrderCriteria;
import com.example.mmoapi.specification.TransactionCriteria;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final WalletService walletService;
    private final TransactionService transactionService;
    private final AccountService accountService;
    private final CouponRepository couponRepository;
    private final CouponService couponService;
    private final ProductRepository productRepository;
    private final MongoTemplate mongoTemplate;

    @Override
    public Page<OrderResponse> getAllOrders(
            String username,
            String orderCode,
            String productCode,
            LocalDateTime createdAt,
            Integer daysRange,
            int pageNumber,
            int pageSize,
            String sortField,
            Sort.Direction sortDirection
    ) {
        Long userId = null;
        if (username != null) {
            User user = userRepository.findByUsername(username).orElse(null);
            userId = (user != null) ? user.getId() : 0;
        }
        Long productId = null;
        if (productCode != null) {
            Product product = productRepository.findByProductCode(productCode);
            productId = (product != null) ? product.getId() : 0;
        }
        Query query = OrderCriteria
                .getOrderByCriteria(userId, orderCode, productId, createdAt, daysRange);
        long totalElements = mongoTemplate.count(query, Order.class);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortDirection, sortField));
        query.with(pageable);
        List<Order> orders = mongoTemplate.find(query, Order.class);
        return new PageImpl<>(orders, pageable, totalElements)
                .map((order) -> orderMapper.convertToResponse(order, true));
    }

    @Override
    public Page<OrderResponse> getAllOrdersByUser(
            String username,
            String orderCode,
            LocalDateTime createdAt,
            Integer daysRange,
            int pageNumber,
            int pageSize,
            String sortField,
            Sort.Direction sortDirection
    ) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Query query = OrderCriteria
                .getOrderByCriteria(user.getId(), orderCode, null, createdAt, daysRange);
        long totalElements = mongoTemplate.count(query, Order.class);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortDirection, sortField));
        query.with(pageable);
        List<Order> orders = mongoTemplate.find(query, Order.class);
        return new PageImpl<>(orders, pageable, totalElements)
                .map((order) -> orderMapper.convertToResponse(order, false));
    }

    @Override
    public long countAllOrders() {
        return orderRepository.count();
    }

    @Override
    public OrderResponse getOrderById(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order with id " + id + " not found"));

        if (order.getIsDeleted()) {
            throw new ResourceNotFoundException("Order with id " + id + " is deleted");
        } else {
            return orderMapper.convertToResponse(order, false);
        }
    }

    @Override
    public OrderResponse addOrder(String username, OrderRequest orderRequest) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Coupon coupon = couponRepository.findById(orderRequest.getCouponId())
                .orElse(null);
        Product product = productRepository.findById(orderRequest.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Order order = new Order();
        orderMapper.convertToRequest(order, orderRequest, user);

        // Check balance
        Wallet wallet = walletRepository.findByUser(user);
        if (wallet == null) {
            throw new ResourceNotFoundException("Wallet not found");
        }

        double amount = product.getSellPrice() * order.getQuantity();

        if (coupon != null) {
            double discount = getDiscount(amount, coupon);
            amount -= discount;
            couponService.updateCouponQuantity(coupon.getId(), 1);
        }
        if (amount > wallet.getBalance()) {
            throw new ResourceNotFoundException("Amount exceeds wallet balance");
        }

        WithdrawRequest withdrawRequest = new WithdrawRequest(amount);
        String transactionId = transactionService.withdraw(username, withdrawRequest);

        walletService.updateWallet(username, amount, TransactionType.WITHDRAW);

        order = orderRepository.save(order);
               transactionService.updateReason(transactionId, "Payment for purchasing " + product.getName() + " - #" + order.getOrderCode());
        accountService.updateAccountsToSold(orderRequest.getProductId(), orderRequest.getQuantity(), order.getId());
        return orderMapper.convertToResponse(order, false);
    }

    private double getDiscount(double amount, Coupon coupon) {
        double discount = amount * (coupon.getDiscount() / 100);

        if (coupon.getMinOrderAmount() == 0 && coupon.getMaxOrderAmount() > 0 && amount > coupon.getMaxOrderAmount()) {
            discount = 0;
        } else if (coupon.getMinOrderAmount() > 0 && coupon.getMaxOrderAmount() == 0 && amount < coupon.getMinOrderAmount()) {
            discount = 0;
        } else if (
                coupon.getMinOrderAmount() > 0 &&
                        coupon.getMaxOrderAmount() > 0 &&
                        (amount < coupon.getMinOrderAmount() || amount > coupon.getMaxOrderAmount())
        ) {
            discount = 0;
        }
        return discount;
    }

    @Override
    public void deleteOrder(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order with id " + id + " not found"));
        order.setIsDeleted(true);
        orderRepository.save(order);
    }

    @Override
    public void deleteManyOrders(List<String> ids) {
        List<Order> orders = orderRepository.findAllById(ids);

        if (orders.size() != ids.size()) {
            List<String> foundIds = orders.stream().map(Order::getId).toList();
            List<String> missingIds = ids.stream()
                    .filter(id -> !foundIds.contains(id))
                    .toList();
            throw new ResourceNotFoundException("Orders with ids " + missingIds + " not found");
        }

        orders.forEach(order -> order.setIsDeleted(true));
        orderRepository.saveAll(orders);
    }

    @Override
    public double calculateTotalProfit() {
        LocalDate today = LocalDate.now();

        List<Order> orders = orderRepository.findAll().stream()
                .filter(order -> order.getCreatedAt().toLocalDate().isEqual(today))
                .collect(Collectors.toList());

        double totalProfit = 0;

        for (Order order : orders) {
            Product product = productRepository.findById(order.getProductId()).orElse(null);
            if (product != null) {
                double profitPerOrder = (product.getSellPrice() - product.getCapitalPrice()) * order.getQuantity();
                totalProfit += profitPerOrder;
            }
        }
        return totalProfit;
    }

    @Override
    public Map<LocalDate, Double> calculateTotalProfitByTime(int month, int year) {
        LocalDate startOfMonth = LocalDate.of(year, month, 1);
        LocalDate endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.lengthOfMonth());

        List<Order> orders = orderRepository.findAll().stream()
                .filter(order -> {
                    LocalDate orderDate = order.getCreatedAt().toLocalDate();
                    return (orderDate.isAfter(startOfMonth.minusDays(1)) && orderDate.isBefore(endOfMonth.plusDays(1)));
                })
                .collect(Collectors.toList());

        Map<LocalDate, Double> dailyProfit = new HashMap<>();

        for (Order order : orders) {
            LocalDate orderDate = order.getCreatedAt().toLocalDate();
            Product product = productRepository.findById(order.getProductId()).orElse(null);
            if (product != null) {
                double profitPerOrder = (product.getSellPrice() - product.getCapitalPrice()) * order.getQuantity();
                dailyProfit.put(orderDate, dailyProfit.getOrDefault(orderDate, 0.0) + profitPerOrder);
            }
        }

        return dailyProfit;
    }

}
