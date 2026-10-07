package vn.sgat.brand_management.features.companies.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.sgat.brand_management.features.companies.api.CompanyRequest;
import vn.sgat.brand_management.features.companies.api.CompanyResponse;
import vn.sgat.brand_management.features.companies.domain.Company;
import vn.sgat.brand_management.features.companies.repository.CompanyRepository;
import vn.sgat.brand_management.shared.exception.ResourceNotFoundException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {
    private final CompanyRepository companyRepository;

    @Transactional(readOnly = true)
    public List<CompanyResponse> list() {
        return companyRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional
    public CompanyResponse create(CompanyRequest request) {
        companyRepository.findByCodeIgnoreCase(request.code().trim()).ifPresent(existing -> {
            throw new IllegalArgumentException("Mã pháp nhân đã tồn tại");
        });
        Company company = new Company();
        company.setCode(request.code().trim().toUpperCase());
        company.setLegalName(request.legalName().trim());
        return toResponse(companyRepository.save(company));
    }

    @Transactional
    public CompanyResponse update(Long id, CompanyRequest request) {
        Company company = find(id);
        company.setCode(request.code().trim().toUpperCase());
        company.setLegalName(request.legalName().trim());
        return toResponse(company);
    }

    @Transactional
    public void deactivate(Long id) {
        find(id).setActive(false);
    }

    public Company find(Long id) {
        return companyRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy pháp nhân: " + id));
    }

    public Company findByCode(String code) {
        return companyRepository.findByCodeIgnoreCase(code.trim())
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mã pháp nhân: " + code));
    }

    private CompanyResponse toResponse(Company company) {
        return new CompanyResponse(company.getId(), company.getCode(), company.getLegalName(), company.isActive());
    }
}
