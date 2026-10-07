package vn.sgat.brand_management.features.companies.api;

import jakarta.validation.constraints.NotBlank;

public record CompanyRequest(
    @NotBlank String code,
    @NotBlank String legalName
) {}
