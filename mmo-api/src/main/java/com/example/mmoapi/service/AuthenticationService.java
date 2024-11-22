package com.example.mmoapi.service;

import com.example.mmoapi.beans.request.auth.LoginRequest;
import com.example.mmoapi.beans.request.auth.SignUpRequest;
import com.example.mmoapi.beans.response.AuthenticationResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public interface AuthenticationService {
    void signUp(SignUpRequest signUpRequest);
    AuthenticationResponse login(LoginRequest loginRequest);
    AuthenticationResponse loginAdmin(LoginRequest loginRequest);
    ResponseEntity<AuthenticationResponse> refreshToken(String refreshToken, HttpServletResponse response);
}
