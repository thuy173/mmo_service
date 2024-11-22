package com.example.mmoapi.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "product_detail")
public class ProductDetail {
    @Id
    @Column(name = "product_id")
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Product product;

    @Column(name = "min_purchase_quantity")
    private long minPurchaseQuantity;

    @Column(name = "max_purchase_quantity")
    private long maxPurchaseQuantity;

    @Column(name = "country_code")
    private String countryCode;

    @Column(name = "short_description", columnDefinition = "TEXT")
    private String shortDescription;

    @Column(name = "detail_description", columnDefinition = "LONGTEXT")
    private String detailDescription;

    @Column(name = "note_file_txt")
    private String noteFileTxt;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "priority_num")
    private int priorityNum;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
