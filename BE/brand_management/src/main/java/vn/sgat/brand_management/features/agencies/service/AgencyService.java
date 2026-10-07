package vn.sgat.brand_management.features.agencies.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.sgat.brand_management.features.agencies.api.AgencyRequest;
import vn.sgat.brand_management.features.agencies.api.AgencyResponse;
import vn.sgat.brand_management.features.agencies.domain.Agency;
import vn.sgat.brand_management.features.agencies.repository.AgencyRepository;
import vn.sgat.brand_management.shared.exception.ResourceNotFoundException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AgencyService {
    private final AgencyRepository agencyRepository;

    @Transactional(readOnly = true)
    public List<AgencyResponse> list() {
        return agencyRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional
    public AgencyResponse create(AgencyRequest request) {
        String name = request.name().trim();
        agencyRepository.findByNameIgnoreCase(name).ifPresent(existing -> {
            throw new IllegalArgumentException("Đơn vị đại diện đã tồn tại");
        });
        Agency agency = new Agency();
        agency.setName(name);
        return toResponse(agencyRepository.save(agency));
    }

    @Transactional
    public AgencyResponse update(Long id, AgencyRequest request) {
        Agency agency = find(id);
        agency.setName(request.name().trim());
        return toResponse(agency);
    }

    @Transactional
    public void deactivate(Long id) {
        find(id).setActive(false);
    }

    public Agency find(Long id) {
        return agencyRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn vị đại diện: " + id));
    }

    private AgencyResponse toResponse(Agency agency) {
        return new AgencyResponse(agency.getId(), agency.getName(), agency.isActive());
    }
}
