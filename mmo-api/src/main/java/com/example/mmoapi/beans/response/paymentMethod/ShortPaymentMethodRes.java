package com.example.mmoapi.beans.response.paymentMethod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShortPaymentMethodRes {
    private Integer id;
    private String name;
    private String description;
}
