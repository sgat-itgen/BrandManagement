package vn.sgat.brand_management.features.trademarks.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "trademark_applications")
public class TrademarkApplication {
    @jakarta.persistence.Id
    @jakarta.persistence.GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "trademark_record_id", nullable = false)
    private TrademarkRecord trademarkRecord;

    @Column(name = "application_no", nullable = false, length = 150)
    private String applicationNo;

    @Column(name = "filed_date")
    private LocalDate filedDate;

    @Column(name = "raw_filed_date", length = 150)
    private String rawFiledDate;

    @Column(name = "jurisdiction_code", nullable = false, length = 10)
    private String jurisdictionCode = "VN";

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TrademarkCertificate> certificates = new ArrayList<>();

    @jakarta.persistence.PrePersist
    void onCreate() {
        createdAt = Instant.now();
    }

    public void addCertificate(TrademarkCertificate certificate) {
        certificates.add(certificate);
        certificate.setApplication(this);
    }
}
