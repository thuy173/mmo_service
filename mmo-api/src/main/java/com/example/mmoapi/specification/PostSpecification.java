package com.example.mmoapi.specification;

import com.example.mmoapi.entity.Post;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class PostSpecification {
    public static Specification<Post> getPostByCriteria(String title, Integer postCategoryId, LocalDateTime createdAt, Integer daysRange){
        return ((root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (title != null && !title.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" + title.toLowerCase() + "%"));
            }

            if (postCategoryId != null) {
                predicates.add(criteriaBuilder.equal(root.get("postCategory").get("id"), postCategoryId));
            }

            if (createdAt != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), createdAt));
            }

            if (daysRange != null && daysRange > 0) {
                LocalDateTime endDateMidnight = LocalDateTime.now().with(LocalTime.MIDNIGHT);
                LocalDateTime endDateMax = LocalDateTime.now().with(LocalTime.MAX);
                LocalDateTime startDate = endDateMidnight.minusDays(daysRange);

                if(daysRange == 1){
                    predicates.add(criteriaBuilder.between(root.get("createdAt"), endDateMidnight, endDateMax));
                }else{
                    predicates.add(criteriaBuilder.between(root.get("createdAt"), startDate, endDateMax));
                }
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        });
    }
}
