package com.example.mmoapi.specification;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.time.LocalDateTime;
import java.time.LocalTime;

public class AccountCriteria {
    public static Query getAccountByCriteria(
            String username,
            Long productId,
            String orderId,
            Boolean isSold,
            LocalDateTime createdAt,
            Integer daysRange
    ) {
        Query query = new Query();

        if (username != null && !username.isEmpty()) {
            query.addCriteria(Criteria.where("username").regex(username, "i"));
        }
        if (productId != null) {
            query.addCriteria(Criteria.where("productId").is(productId));
        }
        if (orderId != null && !orderId.isEmpty()) {
            query.addCriteria(Criteria.where("orderId").is(orderId));
        }
        if (isSold != null) {
            query.addCriteria(Criteria.where("isSold").is(isSold));
        }
        if (createdAt != null) {
            query.addCriteria(Criteria.where("createdAt").gte(createdAt));
        }
        if (daysRange != null) {
            LocalDateTime endDateMidnight = LocalDateTime.now().with(LocalTime.MIDNIGHT);
            LocalDateTime endDateMax = LocalDateTime.now().with(LocalTime.MAX);
            LocalDateTime startDate = endDateMidnight.minusDays(daysRange);

            if(daysRange == 1){
                query.addCriteria(Criteria.where("createdAt").gte(endDateMidnight).lte(endDateMax));
            }else{
                query.addCriteria(Criteria.where("createdAt").gte(startDate).lte(endDateMax));
            }
        }

        return query;
    }
}
