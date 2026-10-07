package vn.sgat.brand_management.features.trademarks.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path root;

    public FileStorageService(@Value("${app.storage.root}") String storageRoot) {
        try {
            root = Paths.get(storageRoot).toAbsolutePath().normalize();
            Files.createDirectories(root);
        } catch (IOException exception) {
            throw new IllegalStateException("Không thể khởi tạo thư mục lưu file", exception);
        }
    }

    public StoredFile store(Long recordId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File không được để trống");
        }
        String originalName = file.getOriginalFilename() == null ? "upload" : file.getOriginalFilename();
        String extension = extensionOf(originalName);
        String storageKey = recordId + "/" + UUID.randomUUID() + extension;
        Path destination = root.resolve(storageKey).normalize();
        if (!destination.startsWith(root)) {
            throw new IllegalArgumentException("Đường dẫn file không hợp lệ");
        }
        try {
            Files.createDirectories(destination.getParent());
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destination);
            }
            return new StoredFile(storageKey, originalName, file.getContentType(), file.getSize());
        } catch (IOException exception) {
            throw new IllegalStateException("Không thể lưu file", exception);
        }
    }

    public Path resolve(String storageKey) {
        Path path = root.resolve(storageKey).normalize();
        if (!path.startsWith(root)) {
            throw new IllegalArgumentException("Đường dẫn file không hợp lệ");
        }
        return path;
    }

    public void delete(String storageKey) {
        try {
            Files.deleteIfExists(resolve(storageKey));
        } catch (IOException exception) {
            throw new IllegalStateException("Không thể xóa file", exception);
        }
    }

    private String extensionOf(String originalName) {
        int dot = originalName.lastIndexOf('.');
        return dot > -1 && dot < originalName.length() - 1 ? originalName.substring(dot).replaceAll("[^a-zA-Z0-9.]", "") : "";
    }

    public record StoredFile(String storageKey, String originalName, String mimeType, long sizeBytes) {
        public String safeMimeType() {
            return mimeType == null || mimeType.isBlank() ? "application/octet-stream" : mimeType;
        }
    }
}
