package vn.sgat.brand_management.features.auth.api;

import vn.sgat.brand_management.features.auth.domain.User;

public record UserResponse(Long id, String email, String name, String role) {
    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getFullName(), user.getRole().name().toLowerCase());
    }
}
