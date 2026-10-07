package vn.sgat.brand_management.features.trademarks.service;

import jakarta.persistence.criteria.JoinType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.sgat.brand_management.features.agencies.domain.Agency;
import vn.sgat.brand_management.features.agencies.service.AgencyService;
import vn.sgat.brand_management.features.companies.domain.Company;
import vn.sgat.brand_management.features.companies.service.CompanyService;
import vn.sgat.brand_management.features.trademarks.api.TrademarkCreateRequest;
import vn.sgat.brand_management.features.trademarks.api.TrademarkPatchRequest;
import vn.sgat.brand_management.features.trademarks.api.TrademarkResponse;
import vn.sgat.brand_management.features.trademarks.domain.DataOrigin;
import vn.sgat.brand_management.features.trademarks.domain.MarkType;
import vn.sgat.brand_management.features.trademarks.domain.NiceClass;
import vn.sgat.brand_management.features.trademarks.domain.TrademarkApplication;
import vn.sgat.brand_management.features.trademarks.domain.TrademarkCertificate;
import vn.sgat.brand_management.features.trademarks.domain.TrademarkRecord;
import vn.sgat.brand_management.features.trademarks.domain.TrademarkStatus;
import vn.sgat.brand_management.features.trademarks.domain.TrademarkStatusHistory;
import vn.sgat.brand_management.features.trademarks.domain.VerificationStatus;
import vn.sgat.brand_management.features.trademarks.repository.NiceClassRepository;
import vn.sgat.brand_management.features.trademarks.repository.TrademarkRecordRepository;
import vn.sgat.brand_management.shared.exception.ResourceNotFoundException;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class TrademarkService {
    private final TrademarkRecordRepository trademarkRecordRepository;
    private final NiceClassRepository niceClassRepository;
    private final CompanyService companyService;
    private final AgencyService agencyService;

    @Transactional(readOnly = true)
    public List<TrademarkResponse> list(String search, String companyCode, String status, String type, Long agencyId) {
        Specification<TrademarkRecord> specification = Specification.where(notDeleted());
        if (companyCode != null && !companyCode.isBlank()) {
            specification = specification.and((root, query, cb) -> cb.equal(
                cb.upper(root.join("company").get("code")), companyCode.trim().toUpperCase()
            ));
        }
        if (status != null && !status.isBlank()) {
            specification = specification.and((root, query, cb) -> cb.equal(root.get("status"), parseStatus(status)));
        }
        if (type != null && !type.isBlank()) {
            specification = specification.and((root, query, cb) -> cb.equal(root.get("markType"), parseMarkType(type)));
        }
        if (agencyId != null) {
            specification = specification.and((root, query, cb) -> cb.equal(root.join("agency").get("id"), agencyId));
        }
        if (search != null && !search.isBlank()) {
            String pattern = "%" + search.trim().toLowerCase() + "%";
            specification = specification.and((root, query, cb) -> {
                query.distinct(true);
                var applications = root.join("applications", JoinType.LEFT);
                return cb.or(
                    cb.like(cb.lower(root.get("markName")), pattern),
                    cb.like(cb.lower(root.get("statusDetail")), pattern),
                    cb.like(cb.lower(applications.get("applicationNo")), pattern)
                );
            });
        }
        return trademarkRecordRepository.findAll(specification).stream().map(TrademarkResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public TrademarkResponse get(Long id) {
        return TrademarkResponse.from(find(id));
    }

    @Transactional
    public TrademarkResponse create(TrademarkCreateRequest request) {
        TrademarkRecord record = new TrademarkRecord();
        record.setCompany(companyService.findByCode(request.companyCode()));
        record.setMarkName(request.markName().trim());
        record.setMarkType(parseMarkType(request.markType()));
        record.setStatus(parseStatus(request.status()));
        record.setStatusDetail(trimToNull(request.statusDetail()));
        record.setAgency(request.agencyId() == null ? null : agencyService.find(request.agencyId()));
        record.setNote(trimToNull(request.note()));
        record.setDataOrigin(DataOrigin.MANUAL);
        record.setVerificationStatus(VerificationStatus.UNVERIFIED);

        if (request.classNumbers() != null) {
            record.getNiceClasses().addAll(niceClassRepository.findAllById(request.classNumbers()));
        }
        addApplicationIfPresent(record, request.applicationNo(), request.filedDate(), request.rawFiledDate(),
            request.certificateNo(), request.issueDate(), request.expiryDate(), request.rawExpiryDate());
        addInitialStatusHistory(record);
        return TrademarkResponse.from(trademarkRecordRepository.save(record));
    }

    @Transactional
    public TrademarkResponse update(Long id, TrademarkPatchRequest request) {
        TrademarkRecord record = find(id);
        TrademarkStatus previousStatus = record.getStatus();
        if (request.status() != null && !request.status().isBlank()) {
            record.setStatus(parseStatus(request.status()));
        }
        if (request.statusDetail() != null) {
            record.setStatusDetail(trimToNull(request.statusDetail()));
        }
        if (request.agencyId() != null) {
            record.setAgency(agencyService.find(request.agencyId()));
        }
        if (request.note() != null) {
            record.setNote(trimToNull(request.note()));
        }
        if (request.expiryDate() != null || request.rawExpiryDate() != null) {
            TrademarkCertificate certificate = firstCertificate(record);
            if (certificate == null) {
                throw new IllegalArgumentException("Không thể cập nhật ngày hết hạn khi hồ sơ chưa có văn bằng");
            }
            certificate.setExpiryDate(request.expiryDate());
            certificate.setRawExpiryDate(trimToNull(request.rawExpiryDate()));
        }
        if (record.getStatus() != previousStatus) {
            TrademarkStatusHistory history = new TrademarkStatusHistory();
            history.setFromStatus(previousStatus);
            history.setToStatus(record.getStatus());
            history.setDetail(record.getStatusDetail());
            history.setEffectiveAt(Instant.now());
            record.addStatusHistory(history);
        }
        return TrademarkResponse.from(record);
    }

    @Transactional
    public void delete(Long id) {
        TrademarkRecord record = find(id);
        record.setDeletedAt(Instant.now());
    }

    public TrademarkRecord find(Long id) {
        return trademarkRecordRepository.findOne(Specification.where(notDeleted()).and((root, query, cb) -> cb.equal(root.get("id"), id)))
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hồ sơ nhãn hiệu: " + id));
    }

    private static Specification<TrademarkRecord> notDeleted() {
        return (root, query, cb) -> cb.isNull(root.get("deletedAt"));
    }

    private void addApplicationIfPresent(
        TrademarkRecord record,
        String applicationNo,
        LocalDate filedDate,
        String rawFiledDate,
        String certificateNo,
        LocalDate issueDate,
        LocalDate expiryDate,
        String rawExpiryDate
    ) {
        if (isBlank(applicationNo) && filedDate == null && isBlank(rawFiledDate) && isBlank(certificateNo)
            && issueDate == null && expiryDate == null && isBlank(rawExpiryDate)) {
            return;
        }
        TrademarkApplication application = new TrademarkApplication();
        application.setApplicationNo(isBlank(applicationNo) ? "UNSPECIFIED" : applicationNo.trim());
        application.setFiledDate(filedDate);
        application.setRawFiledDate(trimToNull(rawFiledDate));
        if (!isBlank(certificateNo) || issueDate != null || expiryDate != null || !isBlank(rawExpiryDate)) {
            TrademarkCertificate certificate = new TrademarkCertificate();
            certificate.setCertificateNo(trimToNull(certificateNo));
            certificate.setIssueDate(issueDate);
            certificate.setExpiryDate(expiryDate);
            certificate.setRawExpiryDate(trimToNull(rawExpiryDate));
            application.addCertificate(certificate);
        }
        record.addApplication(application);
    }

    private void addInitialStatusHistory(TrademarkRecord record) {
        TrademarkStatusHistory history = new TrademarkStatusHistory();
        history.setToStatus(record.getStatus());
        history.setDetail(record.getStatusDetail());
        history.setEffectiveAt(Instant.now());
        record.addStatusHistory(history);
    }

    private TrademarkCertificate firstCertificate(TrademarkRecord record) {
        return record.getApplications().stream()
            .flatMap(application -> application.getCertificates().stream())
            .findFirst()
            .orElse(null);
    }

    private static MarkType parseMarkType(String value) {
        String normalized = value.trim().toUpperCase(Locale.ROOT).replace(" ", "").replace("+", "_").replace("-", "_");
        return switch (normalized) {
            case "LOGO" -> MarkType.LOGO;
            case "TEXT" -> MarkType.TEXT;
            case "VISUAL" -> MarkType.VISUAL;
            case "TEXT_LOGO" -> MarkType.TEXT_LOGO;
            case "LOGO_TEXT" -> MarkType.LOGO_TEXT;
            case "LOGO_TEXT_TAGLINE" -> MarkType.LOGO_TEXT_TAGLINE;
            default -> throw new IllegalArgumentException("Loại nhãn hiệu không hợp lệ: " + value);
        };
    }

    private static TrademarkStatus parseStatus(String value) {
        try {
            return TrademarkStatus.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ: " + value);
        }
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private static String trimToNull(String value) {
        return isBlank(value) ? null : value.trim();
    }
}
