package com.example.mmoapi.beans.response.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TinyProductRes {
    private Long id;
    private String name;
    private String description;
}
