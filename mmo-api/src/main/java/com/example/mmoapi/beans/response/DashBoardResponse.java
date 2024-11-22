package com.example.mmoapi.beans.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashBoardResponse {
    private long users;
    private long orders;
    private double ordersTotal;
    private double revenue;
}
