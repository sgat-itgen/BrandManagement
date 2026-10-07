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
import vn.sgat.brand_management.shared.persistence.AuditableEntity;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "trademark_files")
public class TrademarkFile extends AuditableEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "trademark_record_id", nullable = false)
    private TrademarkRecord trademarkRecord;

    @Enumerated(EnumType.STRING)
    @Column(name = "file_kind", nullable = false, length = 30)
    private FileKind fileKind;

    @Column(name = "original_name", nullable = false, length = 255)
    private String originalName;

    @Column(name = "storage_key", nullable = false, length = 500)
    private String storageKey;

    @Column(name = "mime_type", nullable = false, length = 150)
    private String mimeType;

    @Column(name = "size_bytes", nullable = false)
    private long sizeBytes;

    @Column(name = "is_primary", nullable = false)
    private boolean primary;

    @Column(name = "deleted_at")
    private Instant deletedAt;
}
