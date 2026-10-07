# Brand Management Backend

Backend Spring Boot theo kiến trúc feature-based cho hệ thống quản lý nhãn hiệu.

## Công nghệ

- Java 21 + Spring Boot 4
- Spring MVC, Spring Data JPA, Bean Validation
- PostgreSQL + Flyway
- Redis sẵn sàng cho cache/session mở rộng
- Spring Security session-based authentication
- Local file storage cho logo và attachment

## Khởi động local

Từ thư mục `BE/brand_management`:

```powershell
docker compose up -d postgres redis
./mvnw.cmd spring-boot:run
```

Profile `local` được bật mặc định. Flyway tự tạo schema và seed dữ liệu công ty, agency, Nice classes cùng tài khoản admin mặc định:

- Email: `phapche@saigonanthai.vn`
- Password: `demo123`

Chỉ dùng tài khoản mặc định cho môi trường local. Production phải đặt lại qua `APP_DEFAULT_ADMIN_EMAIL`, `APP_DEFAULT_ADMIN_PASSWORD` hoặc tắt seed.

## API chính

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/companies`
- `GET /api/agencies`
- `GET /api/trademarks`
- `GET /api/trademarks/{id}`
- `POST /api/trademarks`
- `PATCH /api/trademarks/{id}`
- `DELETE /api/trademarks/{id}`
- `POST /api/trademarks/{id}/logo`
- `POST /api/trademarks/{id}/attachments`
- `GET /api/trademarks/{id}/files/{fileId}`

Các API thay đổi dữ liệu yêu cầu role `ADMIN`.

## Cấu trúc feature

```text
src/main/java/vn/sgat/brand_management/
├── features/
│   ├── auth/
│   ├── companies/
│   ├── agencies/
│   └── trademarks/
└── shared/
    ├── api/
    ├── config/
    ├── exception/
    ├── persistence/
    └── security/
```

Swagger UI: `http://localhost:8080/swagger-ui.html`
Health check: `http://localhost:8080/actuator/health`

## Kiểm thử

```powershell
./mvnw.cmd test
```

Test profile dùng H2 tương thích PostgreSQL để kiểm tra migration, authentication và flow tạo/list trademark.
