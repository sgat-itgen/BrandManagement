package vn.sgat.brand_management.features.trademarks.service;

import lombok.RequiredArgsConstructor;
import jakarta.persistence.EntityManager;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import vn.sgat.brand_management.features.trademarks.api.TrademarkResponse;
import vn.sgat.brand_management.features.trademarks.domain.FileKind;
import vn.sgat.brand_management.features.trademarks.domain.TrademarkFile;
import vn.sgat.brand_management.features.trademarks.domain.TrademarkRecord;
import vn.sgat.brand_management.shared.exception.ResourceNotFoundException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TrademarkFileService {
    private final TrademarkService trademarkService;
    private final FileStorageService fileStorageService;
    private final EntityManager entityManager;

    @Transactional
    public List<TrademarkResponse.FileView> addAttachments(Long recordId, List<MultipartFile> files, FileKind kind) {
        TrademarkRecord record = trademarkService.find(recordId);
        return files.stream().map(file -> addOne(record, file, kind, false)).toList();
    }

    @Transactional
    public TrademarkResponse.FileView replaceLogo(Long recordId, MultipartFile file) {
        TrademarkRecord record = trademarkService.find(recordId);
        record.getFiles().stream()
            .filter(existing -> existing.getFileKind() == FileKind.LOGO && existing.getDeletedAt() == null)
            .forEach(existing -> existing.setDeletedAt(Instant.now()));
        return addOne(record, file, FileKind.LOGO, true);
    }

    @Transactional
    public void remove(Long recordId, Long fileId) {
        TrademarkRecord record = trademarkService.find(recordId);
        TrademarkFile file = record.getFiles().stream()
            .filter(item -> item.getId().equals(fileId) && item.getDeletedAt() == null)
            .findFirst()
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy file: " + fileId));
        file.setDeletedAt(Instant.now());
    }

    @Transactional(readOnly = true)
    public StoredResource load(Long recordId, Long fileId) {
        TrademarkRecord record = trademarkService.find(recordId);
        TrademarkFile file = record.getFiles().stream()
            .filter(item -> item.getId().equals(fileId) && item.getDeletedAt() == null)
            .findFirst()
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy file: " + fileId));
        Path path = fileStorageService.resolve(file.getStorageKey());
        try {
            Resource resource = new UrlResource(path.toUri());
            if (!resource.exists()) {
                throw new ResourceNotFoundException("File vật lý không tồn tại: " + file.getOriginalName());
            }
            return new StoredResource(resource, file.getMimeType(), file.getOriginalName());
        } catch (IOException exception) {
            throw new IllegalStateException("Không thể đọc file", exception);
        }
    }

    private TrademarkResponse.FileView addOne(TrademarkRecord record, MultipartFile multipartFile, FileKind kind, boolean primary) {
        FileStorageService.StoredFile stored = fileStorageService.store(record.getId(), multipartFile);
        TrademarkFile file = new TrademarkFile();
        file.setFileKind(kind);
        file.setOriginalName(stored.originalName());
        file.setStorageKey(stored.storageKey());
        file.setMimeType(stored.safeMimeType());
        file.setSizeBytes(stored.sizeBytes());
        file.setPrimary(primary);
        record.addFile(file);
        entityManager.flush();
        return new TrademarkResponse.FileView(
            file.getId(),
            kind.name().toLowerCase(),
            file.getOriginalName(),
            "/api/trademarks/" + record.getId() + "/files/" + file.getId(),
            file.getMimeType(),
            file.getSizeBytes(),
            primary
        );
    }

    public record StoredResource(Resource resource, String mimeType, String originalName) {}
}
