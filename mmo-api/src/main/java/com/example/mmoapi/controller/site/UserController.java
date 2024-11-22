package com.example.mmoapi.controller.site;

import com.example.mmoapi.beans.request.user.ChangePassRequest;
import com.example.mmoapi.beans.request.user.UserRequest;
import com.example.mmoapi.beans.response.WalletResponse;
import com.example.mmoapi.beans.response.user.UserResponse;
import com.example.mmoapi.service.UserService;
import com.example.mmoapi.service.WalletService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users")
public class UserController {
    private final UserService userService;
    private final WalletService walletService;

    @GetMapping
    public ResponseEntity<UserResponse> getUserDetail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return ResponseEntity.ok(userService.getUserDetail(username));
    }

    @GetMapping("/wallet")
    public ResponseEntity<WalletResponse> getWallet() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return ResponseEntity.ok(walletService.getWallet(username));
    }

    @PutMapping
    public ResponseEntity<UserResponse> updateUserDetail(@RequestBody UserRequest userRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        UserResponse user = userService.updateUser(username, userRequest);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/change-password")
    public ResponseEntity<Void> updatePassword(@RequestBody ChangePassRequest changePassRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        userService.updatePassword(username, changePassRequest);
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> uploadAvatar(@RequestParam("file") MultipartFile file) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return ResponseEntity.ok(userService.uploadPhoto(username, file));
    }
}
