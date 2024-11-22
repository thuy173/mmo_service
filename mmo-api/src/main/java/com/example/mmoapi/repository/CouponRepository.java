package com.example.mmoapi.repository;

import com.example.mmoapi.entity.Coupon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long>, PagingAndSortingRepository<Coupon, Long> {
    Optional<Coupon> findByCouponCode(String couponCode);
}
