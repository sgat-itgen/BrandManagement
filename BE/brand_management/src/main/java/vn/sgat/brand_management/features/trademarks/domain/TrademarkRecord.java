package vn.sgat.brand_management.features.trademarks.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.sgat.brand_management.features.agencies.domain.Agency;
import vn.sgat.brand_management.features.auth.domain.User;
import vn.sgat.brand_management.features.companies.domain.Company;
import vn.sgat.brand_management.shared.persistence.AuditableEntity;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "trademark_records")
public class TrademarkRecord extends AuditableEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "mark_name", nullable = false, length = 500)
    private String markName;

    @Enumerated(EnumType.STRING)
    @Column(name = "mark_type", nullable = false, length = 50)
    private MarkType markType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private TrademarkStatus status;

    @Column(name = "status_detail", columnDefinition = "TEXT")
    private String statusDetail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agency_id")
    private Agency agency;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(name = "data_origin", nullable = false, length = 30)
    private DataOrigin dataOrigin;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false, length = 30)
    private VerificationStatus verificationStatus;

    @Column(name = "verification_note", columnDefinition = "TEXT")
    private String verificationNote;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private User updatedBy;

    @OneToMany(mappedBy = "trademarkRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TrademarkApplication> applications = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "trademark_record_classes",
        joinColumns = @JoinColumn(name = "trademark_record_id"),
        inverseJoinColumns = @JoinColumn(name = "class_no")
    )
    private Set<NiceClass> niceClasses = new HashSet<>();

    @OneToMany(mappedBy = "trademarkRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TrademarkFile> files = new ArrayList<>();

    @OneToMany(mappedBy = "trademarkRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TrademarkStatusHistory> statusHistory = new ArrayList<>();

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public void addApplication(TrademarkApplication application) {
        applications.add(application);
        application.setTrademarkRecord(this);
    }

    public void addFile(TrademarkFile file) {
        files.add(file);
        file.setTrademarkRecord(this);
    }

    public void addStatusHistory(TrademarkStatusHistory history) {
        statusHistory.add(history);
        history.setTrademarkRecord(this);
    }
}
