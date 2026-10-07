package vn.sgat.brand_management.features.trademarks.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.Set;

public record TrademarkCreateRequest(
    @NotBlank String companyCode,
    @NotBlank String markName,
    @NotBlank String markType,
    @NotBlank String status,
    String statusDetail,
    Long agencyId,
    String note,
    Set<Integer> classNumbers,
    String applicationNo,
    LocalDate filedDate,
    String rawFiledDate,
    String certificateNo,
    LocalDate issueDate,
    LocalDate expiryDate,
    String rawExpiryDate
) {}
