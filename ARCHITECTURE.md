# Frontend Architecture: Feature-Driven Design

Dự án này sử dụng kiến trúc **Feature-Driven** (một biến thể của Feature-Sliced Design - FSD) nhằm đồng bộ với **Vertical Slice Architecture** của phía Backend (Spring Boot Microservices).

Mục tiêu chính là gom nhóm code theo **Tính năng (Feature)** thay vì theo Loại file (Type).

## 1. Cấu trúc thư mục (Directory Structure)

Toàn bộ logic của ứng dụng nằm trong thư mục `src/`, được chia thành 3 phần chính:

```text
src/
├── app/                  # (1) Routing Layer (Lớp Điều hướng)
├── features/             # (2) Feature Layer (Lớp Tính năng - TRỌNG TÂM)
└── shared/               # (3) Shared Layer (Lớp Dùng chung)
```

### 1.1. Lớp `app/` (Routing)
- Chỉ chịu trách nhiệm về Routing (định tuyến) của Next.js.
- Chứa các file `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`.
- **Nhiệm vụ:** Import các component từ `features/` và lắp ráp chúng thành một trang hoàn chỉnh.
- **Không chứa:** Logic fetch data phức tạp, state management nghiệp vụ.

### 1.2. Lớp `features/` (Các tính năng)
- Đại diện cho các "Vertical Slices" của Frontend. Tương ứng 1-1 với các Service/Slice bên Backend (vd: Catalog, Cart, Order, Identity).
- Mỗi thư mục con trong `features/` là một vương quốc độc lập:
  ```text
  features/catalog/
  ├── components/   # UI Components chỉ dùng cho catalog (ProductCard, ...)
  ├── hooks/        # Custom hooks riêng (useProducts)
  ├── api/          # Gọi API tới backend (getProducts.ts)
  ├── store/        # Zustand store quản lý state cục bộ
  └── types/        # TypeScript interfaces/types
  ```

### 1.3. Lớp `shared/` (Dùng chung)
- Chứa các thành phần cốt lõi, UI tĩnh và các công cụ được dùng trên toàn bộ ứng dụng.
- **Cấu trúc:**
  - `components/`: UI Library (Button, Input, Modal, Table...). Đây là những component "ngu" (dumb component), không gọi API, không chứa logic nghiệp vụ.
  - `api/`: Cấu hình Axios Base (`axiosClient.ts`).
  - `providers/`: Các React Context Provider (`QueryProvider.tsx`).
  - `lib/`: Các hàm tiện ích (utils, helpers, formatters).
  - `hooks/`: Các custom hook chung (useWindowSize, useDebounce).
  - `types/`: Các type chung (Pagination, ErrorResponse).

---

## 2. Luật Phụ thuộc (Dependency Rules)

Để giữ kiến trúc luôn sạch, bạn MẶC ĐỊNH PHẢI TUÂN THỦ các luật sau:

1. **Chiều import (Từ trên xuống dưới):**
   - `app/` có thể import từ `features/` và `shared/`.
   - `features/` có thể import từ `shared/`.
   - `shared/` **KHÔNG BAO GIỜ** được import từ `features/` hoặc `app/`.

2. **Giao tiếp giữa các Features:**
   - Hạn chế tối đa việc Feature A import trực tiếp code từ Feature B (ví dụ `features/cart` import `features/catalog`).
   - Nếu thực sự cần, hãy chia sẻ qua Global State (Zustand) hoặc đẩy phần dùng chung đó xuống `shared/`.

---

## 3. Tech Stack cốt lõi

- **Framework:** Next.js (App Router) + React 19.
- **Styling:** Tailwind CSS v4.
- **Data Fetching & Server State:** `@tanstack/react-query`. Mọi thao tác gọi API (GET, POST, PUT, DELETE) đều nên bọc bằng React Query (`useQuery`, `useMutation`).
- **HTTP Client:** `axios` (đã config sẵn tại `src/shared/api/axiosClient.ts`).
- **Client State Management:** `zustand`. Chỉ dùng cho state cần share giữa các component không có quan hệ cha-con gần (vd: trạng thái mở/đóng giỏ hàng ở navbar). Nếu state chỉ liên quan đến API, hãy dùng React Query.

---

## 4. Hướng dẫn tạo một Feature mới

**Ví dụ: Tạo tính năng Giỏ hàng (Cart)**

**Bước 1:** Tạo thư mục `src/features/cart`.
**Bước 2:** Khai báo Type/Interface trong `src/features/cart/types/index.ts`.
**Bước 3:** Khai báo API call bằng Axios trong `src/features/cart/api/getCart.ts`.
**Bước 4:** Tạo React Query Hook trong `src/features/cart/hooks/useCart.ts` (sử dụng hàm gọi API ở bước 3).
**Bước 5:** Xây dựng UI trong `src/features/cart/components/CartSidebar.tsx` (sử dụng hook ở bước 4).
**Bước 6:** Import `CartSidebar` vào `src/app/layout.tsx` hoặc `src/app/cart/page.tsx` để hiển thị.

---
*Viết bởi AI Assistant. Hãy bám sát kiến trúc này để dự án của bạn có thể scale mượt mà theo kiến trúc Microservices của Backend!*
