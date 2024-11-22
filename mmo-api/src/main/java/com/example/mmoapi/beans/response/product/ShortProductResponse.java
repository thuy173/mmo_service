package com.example.mmoapi.beans.response.product;

import com.example.mmoapi.beans.response.productCategory.ShortSubProductCategoryRes;
import com.example.mmoapi.enums.CheckLiveAccountStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShortProductResponse {
    private Long id;
    private ShortSubProductCategoryRes productSubCategory;
    private String name;
    private String productCode;
    private double sellPrice;
    private double capitalPrice;
    private double discount;
    private long availableAccountQty;
    private long soldAccountQty;
    private CheckLiveAccountStatus checkLiveAccountStatus;
    private String countryCode;
    private String shortDescription;
    private String image;
    private int priorityNum;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isActive;
}
