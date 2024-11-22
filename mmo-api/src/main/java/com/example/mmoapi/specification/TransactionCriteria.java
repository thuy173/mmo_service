package com.example.mmoapi.specification;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.time.LocalDateTime;
import java.time.LocalTime;

public class TransactionCriteria {
    public static Query getTransactionByCriteria(
            Long userId,
            String reason,
            LocalDateTime createdAt,
            Integer daysRange
    ) {
        Query query = new Query();

        if (userId != null) {
            query.addCriteria(Criteria.where("userId").is(userId));
        }
        if (reason != null && !reason.isEmpty()) {
            query.addCriteria(Criteria.where("reason").regex(reason, "i"));
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
