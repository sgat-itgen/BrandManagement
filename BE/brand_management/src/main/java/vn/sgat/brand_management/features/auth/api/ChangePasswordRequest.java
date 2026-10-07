package vn.sgat.brand_management.features.auth.api;

import jakarta.validation.constraints.NotBlank;

public record ChangePasswordRequest(
    @NotBlank String currentPassword,
    @NotBlank String newPassword,
    @NotBlank String confirmPassword
) {}
