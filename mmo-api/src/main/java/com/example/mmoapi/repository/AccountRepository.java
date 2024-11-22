package com.example.mmoapi.repository;

import com.example.mmoapi.entity.Account;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends MongoRepository<Account, String> {
    void deleteByIsSoldAndProductId(Boolean isSold, Long productId);
    long countByProductIdAndIsSold(Long productId, Boolean isSold);
}
