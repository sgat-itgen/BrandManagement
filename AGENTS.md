# Brand Management — Quy ước & Bối cảnh dự án

## Nguồn tham chiếu
File `Dashboard_Nhan_Hieu_An_Thai.html` (đính kèm/uploaded) là bản PROTOTYPE tĩnh
(vanilla JS + localStorage) — dùng làm SPEC để lấy: data model, business logic,
UI layout, màu sắc thương hiệu. KHÔNG copy nguyên code JS thuần từ đó, phải viết
lại đúng chuẩn React + TypeScript + TanStack Query.

## Kiến trúc bắt buộc
Feature-based:
src/features/{feature}/
  types.ts        — TypeScript interfaces
  api.ts          — hàm gọi API (hiện tại là mock async)
  mocks.ts        — data mẫu
  hooks/          — custom hooks dùng TanStack Query
  components/     — component thuần, nhận data qua props/hooks

src/shared/
  components/ui/  — component dùng chung nhiều feature (shadcn)
  lib/            — helper functions dùng chung

## Data fetching
- LUÔN dùng TanStack Query (useQuery/useMutation), KHÔNG dùng useEffect + fetch tay
- KHÔNG dùng localStorage để lưu state nghiệp vụ (khác với file HTML gốc) —
  mọi thứ phải đi qua mock API layer (async function), chuẩn bị sẵn để sau này
  swap sang API thật chỉ cần đổi file api.ts

## Styling
- Tailwind v4, biến màu khai báo trong src/index.css @theme
- Khi convert từ CSS gốc (file HTML), map class CSS cũ sang Tailwind utility,
  KHÔNG copy nguyên <style> block

## Khi convert 1 phần từ file HTML gốc
1. Đọc kỹ phần JS liên quan (biến, hàm render, event handler)
2. Xác định: đây là SERVER STATE (cần fetch qua API) hay UI STATE (chỉ tồn tại
   trên client, VD: filter, view toggle, modal open)
3. Server state → đưa vào hooks/ dùng TanStack Query
4. UI state → dùng useState hoặc zustand tại component tương ứng
5. Viết lại thành component React thuần, có TypeScript type cho props

## Việc KHÔNG được làm
- Không tự ý cài thêm package ngoài package.json hiện có
- Không tự sửa file types.ts nếu không được yêu cầu rõ
- Không copy business logic đã lỗi thời của bản gốc (VD: check quyền admin
  chỉ ở client — phải note lại đây là điểm cần enforce ở backend sau này)