package vn.sgat.brand_management.features.trademarks.api;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import vn.sgat.brand_management.features.trademarks.domain.FileKind;
import vn.sgat.brand_management.features.trademarks.service.TrademarkFileService;
import vn.sgat.brand_management.features.trademarks.service.TrademarkService;

import java.util.List;

@RestController
@RequestMapping("/api/trademarks")
@RequiredArgsConstructor
public class TrademarkController {
    private final TrademarkService trademarkService;
    private final TrademarkFileService trademarkFileService;

    @GetMapping
    public List<TrademarkResponse> list(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String company,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String type,
        @RequestParam(required = false) Long agencyId
    ) {
        return trademarkService.list(search, company, status, type, agencyId);
    }

    @GetMapping("/{id}")
    public TrademarkResponse get(@PathVariable Long id) {
        return trademarkService.get(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public TrademarkResponse create(@Valid @RequestBody TrademarkCreateRequest request) {
        return trademarkService.create(request);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public TrademarkResponse update(@PathVariable Long id, @RequestBody TrademarkPatchRequest request) {
        return trademarkService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        trademarkService.delete(id);
    }

    @PostMapping(value = "/{id}/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public TrademarkResponse.FileView uploadLogo(@PathVariable Long id, @RequestPart("file") MultipartFile file) {
        return trademarkFileService.replaceLogo(id, file);
    }

    @PostMapping(value = "/{id}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public List<TrademarkResponse.FileView> uploadAttachments(
        @PathVariable Long id,
        @RequestPart("files") List<MultipartFile> files
    ) {
        return trademarkFileService.addAttachments(id, files, FileKind.DOCUMENT);
    }

    @GetMapping("/{id}/files/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id, @PathVariable Long fileId) {
        var stored = trademarkFileService.load(id, fileId);
        return ResponseEntity.ok()
            .contentType(parseMediaType(stored.mimeType()))
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + stored.originalName().replace("\"", "") + "\"")
            .body(stored.resource());
    }

    @DeleteMapping("/{id}/files/{fileId}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteFile(@PathVariable Long id, @PathVariable Long fileId) {
        trademarkFileService.remove(id, fileId);
    }

    private MediaType parseMediaType(String value) {
        try {
            return MediaType.parseMediaType(value);
        } catch (IllegalArgumentException exception) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }
    }
}
