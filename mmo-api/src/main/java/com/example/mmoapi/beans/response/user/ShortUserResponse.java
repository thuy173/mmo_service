package com.example.mmoapi.beans.response.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShortUserResponse {
    private Long id;
    private String fullName;
    private String username;
    private String avatar;
}
