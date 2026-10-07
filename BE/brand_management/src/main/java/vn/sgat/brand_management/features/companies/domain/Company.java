package vn.sgat.brand_management.features.companies.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.sgat.brand_management.shared.persistence.AuditableEntity;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "companies")
public class Company extends AuditableEntity {
    @Column(nullable = false, unique = true, length = 30)
    private String code;

    @Column(name = "legal_name", nullable = false, length = 255)
    private String legalName;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;
}
