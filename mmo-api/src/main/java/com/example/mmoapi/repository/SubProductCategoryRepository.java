package com.example.mmoapi.repository;

import com.example.mmoapi.entity.ProductCategory;
import com.example.mmoapi.entity.SubProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubProductCategoryRepository extends JpaRepository<SubProductCategory, Integer> {
    List<SubProductCategory> findAllByProductCategory(ProductCategory productCategory);
}
