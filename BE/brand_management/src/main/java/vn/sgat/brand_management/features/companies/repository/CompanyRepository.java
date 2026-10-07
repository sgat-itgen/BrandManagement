package vn.sgat.brand_management.features.companies.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.sgat.brand_management.features.companies.domain.Company;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByCodeIgnoreCase(String code);
}
