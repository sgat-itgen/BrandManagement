package vn.sgat.brand_management.features.agencies.api;

import jakarta.validation.constraints.NotBlank;

public record AgencyRequest(@NotBlank String name) {}
