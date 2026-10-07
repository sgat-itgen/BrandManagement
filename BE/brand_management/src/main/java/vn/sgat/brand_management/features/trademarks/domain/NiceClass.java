package vn.sgat.brand_management.features.trademarks.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "nice_classes")
public class NiceClass {
    @Id
    @Column(name = "class_no")
    private Integer classNo;

    @Column(length = 255)
    private String name;

    private String description;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;
}
