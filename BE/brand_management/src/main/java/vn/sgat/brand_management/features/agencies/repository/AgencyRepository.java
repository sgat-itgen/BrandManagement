package vn.sgat.brand_management.features.agencies.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.sgat.brand_management.features.agencies.domain.Agency;

import java.util.Optional;

public interface AgencyRepository extends JpaRepository<Agency, Long> {
    Optional<Agency> findByNameIgnoreCase(String name);
}
