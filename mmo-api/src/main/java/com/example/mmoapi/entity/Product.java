package com.example.mmoapi.entity;

import com.example.mmoapi.enums.CheckLiveAccountStatus;
import com.example.mmoapi.utils.UniqueStringGenerator;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sub_product_category_id")
    private SubProductCategory subProductCategory;

    @Column(name = "product_code", unique = true, nullable = false)
    private String productCode;

    private String name;

    @Column(name = "sell_price")
    private double sellPrice;

    @Column(name = "capital_price")
    private double capitalPrice;

    private double discount;

    @Column(name = "check_live_account_status")
    private CheckLiveAccountStatus checkLiveAccountStatus;

    @Column(name = "is_active")
    private boolean isActive;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductCoupon> productCouponList;

    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private ProductDetail productDetail;

    @PrePersist
    protected void onCreate() {
        if (productCode == null || productCode.isEmpty()) {
            productCode = UniqueStringGenerator.generateUniqueString(10);
        }
    }
}
