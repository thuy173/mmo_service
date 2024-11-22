package com.example.mmoapi.repository;

import com.example.mmoapi.entity.User;
import com.example.mmoapi.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {
    Wallet findByUser(User user);
}
