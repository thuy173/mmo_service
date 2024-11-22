package com.example.mmoapi.service;

import com.example.mmoapi.beans.request.user.ChangePassRequest;
import com.example.mmoapi.beans.request.user.UserRequest;
import com.example.mmoapi.beans.response.user.UserResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface UserService {
    UserResponse getUserDetail(String username);
    UserResponse updateUser(String username, UserRequest userRequest);
    long countUsers();
    String uploadPhoto(String username, MultipartFile file);
    void updatePassword(String username, ChangePassRequest changePassRequest);
}
