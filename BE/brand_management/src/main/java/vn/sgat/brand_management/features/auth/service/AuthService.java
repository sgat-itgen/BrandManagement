package vn.sgat.brand_management.features.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.sgat.brand_management.features.auth.api.LoginRequest;
import vn.sgat.brand_management.features.auth.api.UserResponse;
import vn.sgat.brand_management.features.auth.domain.User;
import vn.sgat.brand_management.features.auth.repository.UserRepository;
import vn.sgat.brand_management.shared.exception.ResourceNotFoundException;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.email().trim())
            .orElseThrow(() -> new ResourceNotFoundException("Email hoặc mật khẩu không đúng"));
        if (!user.isActive() || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Email hoặc mật khẩu không đúng");
        }
        user.setLastLoginAt(Instant.now());
        return user;
    }

    public UserResponse me(User user) {
        return UserResponse.from(user);
    }

    public User find(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));
    }
}
