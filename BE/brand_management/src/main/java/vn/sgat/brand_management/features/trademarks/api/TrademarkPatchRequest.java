package vn.sgat.brand_management.features.trademarks.api;

import java.time.LocalDate;

public record TrademarkPatchRequest(
    String status,
    String statusDetail,
    Long agencyId,
    String note,
    LocalDate expiryDate,
    String rawExpiryDate
) {}
