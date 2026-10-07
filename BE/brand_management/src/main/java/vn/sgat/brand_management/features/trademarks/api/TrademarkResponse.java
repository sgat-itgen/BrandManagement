package vn.sgat.brand_management.features.trademarks.api;

import vn.sgat.brand_management.features.trademarks.domain.TrademarkRecord;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record TrademarkResponse(
    Long id,
    CompanyView company,
    String mark,
    String type,
    String status,
    String statusDetail,
    AgencyView agency,
    String note,
    List<Integer> groups,
    List<ApplicationView> applications,
    List<FileView> attachments,
    String dataOrigin,
    String verificationStatus,
    String verificationNote,
    Instant createdAt,
    Instant updatedAt
) {
    public static TrademarkResponse from(TrademarkRecord record) {
        List<ApplicationView> applications = record.getApplications().stream()
            .map(application -> new ApplicationView(
                application.getId(),
                application.getApplicationNo(),
                application.getFiledDate(),
                application.getRawFiledDate(),
                application.getCertificates().stream().map(certificate -> new CertificateView(
                    certificate.getId(),
                    certificate.getCertificateNo(),
                    certificate.getIssueDate(),
                    certificate.getExpiryDate(),
                    certificate.getRawExpiryDate()
                )).toList()
            )).toList();

        return new TrademarkResponse(
            record.getId(),
            new CompanyView(record.getCompany().getId(), record.getCompany().getCode(), record.getCompany().getLegalName()),
            record.getMarkName(),
            record.getMarkType().name().toLowerCase(),
            record.getStatus().name().toLowerCase(),
            record.getStatusDetail(),
            record.getAgency() == null ? null : new AgencyView(record.getAgency().getId(), record.getAgency().getName()),
            record.getNote(),
            record.getNiceClasses().stream().map(niceClass -> niceClass.getClassNo()).sorted().toList(),
            applications,
            record.getFiles().stream().filter(file -> file.getDeletedAt() == null).map(file -> new FileView(
                file.getId(),
                file.getFileKind().name().toLowerCase(),
                file.getOriginalName(),
                "/api/trademarks/" + record.getId() + "/files/" + file.getId(),
                file.getMimeType(),
                file.getSizeBytes(),
                file.isPrimary()
            )).toList(),
            record.getDataOrigin().name().toLowerCase(),
            record.getVerificationStatus().name().toLowerCase(),
            record.getVerificationNote(),
            record.getCreatedAt(),
            record.getUpdatedAt()
        );
    }

    public record CompanyView(Long id, String code, String legalName) {}
    public record AgencyView(Long id, String name) {}
    public record ApplicationView(Long id, String applicationNo, LocalDate filedDate, String rawFiledDate, List<CertificateView> certificates) {}
    public record CertificateView(Long id, String certificateNo, LocalDate issueDate, LocalDate expiryDate, String rawExpiryDate) {}
    public record FileView(Long id, String kind, String name, String url, String type, long size, boolean primary) {}
}
