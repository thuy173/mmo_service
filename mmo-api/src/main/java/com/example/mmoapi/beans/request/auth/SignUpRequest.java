package com.example.mmoapi.beans.request.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignUpRequest {
    private String fullName;
    private String username;
    private String password;
    private String email;
    private String phone;
}
