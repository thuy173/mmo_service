package com.example.mmoapi.mapper;

import com.example.mmoapi.beans.request.user.UserRequest;
import com.example.mmoapi.beans.response.user.ShortUserResponse;
import com.example.mmoapi.beans.response.user.UserResponse;
import com.example.mmoapi.entity.User;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class UserMapper {
    public void convertToRequest(User user, UserRequest userRequest){
        user.setFullName(userRequest.getFullName());
        user.setUsername(userRequest.getUsername());
        user.setEmail(userRequest.getEmail());
        user.setPhone(userRequest.getPhone());
        user.setUpdatedAt(LocalDateTime.now());
    }

    public UserResponse convertToResponse(User user){
        UserResponse userResponse = new UserResponse();
        userResponse.setFullName(user.getFullName());
        userResponse.setAvatar(user.getAvatar());
        userResponse.setUsername(user.getUsername());
        userResponse.setEmail(user.getEmail());
        userResponse.setPhone(user.getPhone());
        return userResponse;
    }

    public ShortUserResponse convertToShortResponse(User user){
        ShortUserResponse shortUserResponse = new ShortUserResponse();
        shortUserResponse.setId(user.getId());
        shortUserResponse.setFullName(user.getFullName());
        shortUserResponse.setAvatar(user.getAvatar());
        return shortUserResponse;
    }
}
