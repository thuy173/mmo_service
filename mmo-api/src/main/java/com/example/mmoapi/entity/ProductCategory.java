package com.example.mmoapi.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "product_categories")
public class ProductCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @Column(name = "icon_url")
    private String iconUrl;

    private String description;

    @Column(name = "is_active")
    private boolean isActive;

    @Column(name = "order_num")
    private int orderNum;

    @OneToMany(mappedBy = "productCategory", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SubProductCategory> subProductCategoryList;
}
