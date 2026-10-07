package vn.sgat.brand_management.features.agencies.api;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.sgat.brand_management.features.agencies.service.AgencyService;

import java.util.List;

@RestController
@RequestMapping("/api/agencies")
@RequiredArgsConstructor
public class AgencyController {
    private final AgencyService agencyService;

    @GetMapping
    public List<AgencyResponse> list() {
        return agencyService.list();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AgencyResponse create(@Valid @RequestBody AgencyRequest request) {
        return agencyService.create(request);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public AgencyResponse update(@PathVariable Long id, @Valid @RequestBody AgencyRequest request) {
        return agencyService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        agencyService.deactivate(id);
    }
}
