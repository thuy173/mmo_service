package com.example.mmoapi.beans.request.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangePassRequest {
    private String currentPassword;
    private String newPassword;
    private String confirmPassword;
}
