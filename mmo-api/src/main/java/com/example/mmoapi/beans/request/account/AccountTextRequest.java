package com.example.mmoapi.beans.request.account;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountTextRequest {
    private Long productId;
    private String account;
}
