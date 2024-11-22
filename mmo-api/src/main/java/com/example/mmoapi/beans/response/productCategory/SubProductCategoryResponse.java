package com.example.mmoapi.beans.response.productCategory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubProductCategoryResponse {
    private Integer id;
    private Integer productCategoryId;
    private String name;
    private String icon;
    private String description;
    private boolean isActive;
    private int orderNum;
}
