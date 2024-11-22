package com.example.mmoapi.beans.response.productCategory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShortSubProductCategoryRes {
    private Integer id;
    private String name;
    private String icon;
}
