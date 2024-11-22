package com.example.mmoapi.mapper;

import com.example.mmoapi.beans.request.auth.SignUpRequest;
import com.example.mmoapi.entity.Role;
import com.example.mmoapi.entity.User;
import com.example.mmoapi.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class AuthMapper {
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    public void convertToRequest(User user, SignUpRequest signUpRequest){
        user.setFullName(signUpRequest.getFullName());
        user.setUsername(signUpRequest.getUsername());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setEmail(signUpRequest.getEmail());
        user.setPhone(signUpRequest.getPhone());
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        Role userRole = roleRepository.findByName("ROLE_USER");

        if(userRole == null){
            userRole = new Role();
            userRole.setName("ROLE_USER");
            userRole = roleRepository.save(userRole);
        }

        user.setRole(userRole);
    }
}
