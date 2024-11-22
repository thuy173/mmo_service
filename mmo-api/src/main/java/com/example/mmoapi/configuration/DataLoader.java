package com.example.mmoapi.configuration;

import com.example.mmoapi.entity.Role;
import com.example.mmoapi.entity.User;
import com.example.mmoapi.repository.RoleRepository;
import com.example.mmoapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        Role adminRole = new Role("ROLE_ADMIN");
        Role userRole = new Role("ROLE_USER");
        if(roleRepository.findByName("ROLE_ADMIN") == null) {
            roleRepository.save(adminRole);
        }

        if(roleRepository.findByName("ROLE_USER") == null) {
            roleRepository.save(userRole);
        }

        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setFullName("Admin");
            admin.setAvatar("admin-avatar.png");
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setEmail("admin@example.com");
            admin.setPhone("123-456-7890");
            admin.setActive(true);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());
            admin.setRole(adminRole);

            userRepository.save(admin);
        }
    }
}
