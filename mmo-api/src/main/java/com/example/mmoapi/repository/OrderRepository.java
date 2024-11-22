package com.example.mmoapi.repository;

import com.example.mmoapi.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends MongoRepository<Order, String>{
    Page<Order> findAllByUserId(Long userId, Pageable pageable);
    Optional<Order> findByOrderCode(String orderCode);
}
