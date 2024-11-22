package com.example.mmoapi.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "sub_product_categories")
public class SubProductCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "product_category_id")
    private ProductCategory productCategory;

    private String name;

    @Column(name = "icon_url")
    private String iconUrl;

    private String description;

    @Column(name = "is_active")
    private boolean isActive;

    @Column(name = "order_num")
    private int orderNum;

    @OneToMany(mappedBy = "subProductCategory", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Product> productList;
}
