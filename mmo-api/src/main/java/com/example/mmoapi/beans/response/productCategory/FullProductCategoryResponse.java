package com.example.mmoapi.beans.response.productCategory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FullProductCategoryResponse {
    private Integer id;
    private String name;
    private String icon;
    private String description;
    private boolean isActive;
    private int orderNum;
    private List<SubProductCategoryResponse> subProductCategories;
}
