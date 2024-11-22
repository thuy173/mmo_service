package com.example.mmoapi.specification;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.time.LocalDateTime;
import java.time.LocalTime;

public class OrderCriteria {
    public static Query getOrderByCriteria(
            Long userId,
            String orderCode,
            Long productId,
            LocalDateTime createdAt,
            Integer daysRange
    ) {
        Query query = new Query();

        if (userId != null) {
            query.addCriteria(Criteria.where("userId").is(userId));
        }
        if (orderCode != null && !orderCode.isEmpty()) {
            query.addCriteria(Criteria.where("orderCode").regex(orderCode, "i"));
        }
        if (productId != null) {
            query.addCriteria(Criteria.where("productId").is(productId));
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
