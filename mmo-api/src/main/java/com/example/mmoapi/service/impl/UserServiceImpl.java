package com.example.mmoapi.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.mmoapi.beans.request.user.ChangePassRequest;
import com.example.mmoapi.beans.request.user.UserRequest;
import com.example.mmoapi.beans.response.user.UserResponse;
import com.example.mmoapi.entity.User;
import com.example.mmoapi.exception.ResourceNotFoundException;
import com.example.mmoapi.mapper.UserMapper;
import com.example.mmoapi.repository.UserRepository;
import com.example.mmoapi.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.Role;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final Cloudinary cloudinary;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse getUserDetail(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(()-> new ResourceNotFoundException("User not found"));
        return userMapper.convertToResponse(user);
    }

    @Override
    public UserResponse updateUser(String username, UserRequest userRequest) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(()-> new ResourceNotFoundException("User not found"));
        userMapper.convertToRequest(user, userRequest);
        userRepository.save(user);
        return userMapper.convertToResponse(user);
    }

    @Override
    public long countUsers() {
        return userRepository.countByRoleName("ROLE_USER");
    }

    @Override
    public String uploadPhoto(String username, MultipartFile file) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (file.isEmpty())
            throw new IllegalArgumentException("Cannot upload empty file");

        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            String imageUrl = uploadResult.get("url").toString();
            user.setAvatar(imageUrl);

            userRepository.save(user);
            return imageUrl;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    @Override
    public void updatePassword(String username, ChangePassRequest changePassRequest) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(changePassRequest.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        if(!changePassRequest.getNewPassword().equals(changePassRequest.getConfirmPassword())){
            throw new RuntimeException("Confirm password is not match");
        }

        // Encode and set the new password, then save the user
        user.setPassword(passwordEncoder.encode(changePassRequest.getNewPassword()));
        userRepository.save(user);
    }
}
