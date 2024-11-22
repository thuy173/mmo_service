package com.example.mmoapi.beans.response.account;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountAvailableRes {
    private String id;
    private String account;
    private String productCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
