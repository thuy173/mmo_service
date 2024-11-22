package com.example.mmoapi.service.impl;

import com.example.mmoapi.beans.request.auth.LoginRequest;
import com.example.mmoapi.beans.request.auth.SignUpRequest;
import com.example.mmoapi.beans.response.AuthenticationResponse;
import com.example.mmoapi.entity.User;
import com.example.mmoapi.entity.Wallet;
import com.example.mmoapi.exception.ConflictException;
import com.example.mmoapi.exception.ResourceNotFoundException;
import com.example.mmoapi.mapper.AuthMapper;
import com.example.mmoapi.repository.UserRepository;
import com.example.mmoapi.repository.WalletRepository;
import com.example.mmoapi.service.AuthenticationService;
import com.example.mmoapi.utils.JwtUtils;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserRepository userRepository;
    private final AuthMapper authMapper;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final WalletRepository walletRepository;

    @Override
    public void signUp(SignUpRequest signUpRequest) {
        if (userRepository.findByUsername(signUpRequest.getUsername()).isPresent())
            throw new ConflictException("User already exists");

        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent())
            throw new ConflictException("Email already exists");

        User user = new User();
        authMapper.convertToRequest(user, signUpRequest);
        user = userRepository.save(user);

        Wallet wallet = new Wallet();
        wallet.setUser(user);
        wallet.setBalance(0);
        wallet.setCreatedAt(LocalDateTime.now());
        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);
    }

    @Override
    public AuthenticationResponse login(LoginRequest loginRequest) {
        return authenticateAndGenerateTokens(loginRequest, "ROLE_USER");
    }

    @Override
    public AuthenticationResponse loginAdmin(LoginRequest loginRequest) {
        return authenticateAndGenerateTokens(loginRequest, "ROLE_ADMIN");
    }

    private AuthenticationResponse authenticateAndGenerateTokens(LoginRequest loginRequest, String requiredRole) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Username not found"));

        if (!user.getRole().getName().equals(requiredRole)) {
            throw new SecurityException("User does not have the required role: " + requiredRole);
        }

        String accessToken = jwtUtils.generateAccessToken(user);
        String refreshToken = jwtUtils.generateRefreshToken(user);

        return new AuthenticationResponse(accessToken, refreshToken, "User login successfully");
    }


    @Override
    public ResponseEntity<AuthenticationResponse> refreshToken(String refreshToken, HttpServletResponse response) {
        return null;
    }
}
