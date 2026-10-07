package vn.sgat.brand_management.features.trademarks.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.sgat.brand_management.features.auth.domain.User;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "trademark_status_history")
public class TrademarkStatusHistory {
    @jakarta.persistence.Id
    @jakarta.persistence.GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "trademark_record_id", nullable = false)
    private TrademarkRecord trademarkRecord;

    @Enumerated(EnumType.STRING)
    @Column(name = "from_status", length = 50)
    private TrademarkStatus fromStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "to_status", nullable = false, length = 50)
    private TrademarkStatus toStatus;

    @Column(columnDefinition = "TEXT")
    private String detail;

    @Column(name = "effective_at", nullable = false)
    private Instant effectiveAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by")
    private User changedBy;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @jakarta.persistence.PrePersist
    void onCreate() {
        createdAt = Instant.now();
        if (effectiveAt == null) {
            effectiveAt = createdAt;
        }
    }
}
