# Web Tank Gauging - Frontend UI
Dự án giao diện Web quản lý bồn chứa xăng dầu, hiển thị số liệu trực quan và giám sát theo thời gian thực.

## 1. Công nghệ sử dụng
- **React.js** (Khung ứng dụng chính)
- **Tailwind CSS** (Tùy biến giao diện)
- **Ant Design** (Component UI như Table, Button, DatePicker)
- **Lucide React** (Icon hệ thống)

## 2. Cấu trúc thư mục
- `src/components/`: Chứa các Component dùng chung (như `AppLayout.js` đã được làm mỏng gọn gàng).
- `src/pages/`: Chứa giao diện chính của các màn hình:
  - `Tanks.js`: Màn hình Quản lý Bồn (Hiển thị dạng Grid các Tank Card).
  - `NhapBon.js`: Màn hình quy trình Chốt số liệu nhập bồn.
  - `Home.js`: Trang chủ tổng quan.
- `src/routers/`: Cấu hình Router điều hướng các trang.
- `src/contexts/`: Chứa Context API quản lý trạng thái (Ví dụ AuthContext).

## 3. Luồng hoạt động & Chức năng (Flows)
### A. Màn hình Giám sát (Tanks.js)
1. **Lọc theo Trạm**: User chọn Trạm từ Dropdown. Component sẽ lọc và chỉ hiển thị các Bồn thuộc trạm đó.
2. **Hiển thị Bồn (Gauge Chart)**: 
   - Số liệu (Current Volume, Empty Volume, Temp) được vẽ trên một biểu đồ hình tròn (Circular Gauge).
   - Có cơ chế cảnh báo màu sắc (Màu Đỏ nếu bồn tràn hoặc cạn).
3. **Chi tiết Bồn (Inline Detail)**: 
   - Khi bấm nút "Chi tiết", giao diện chuyển sang dạng Inline Detail View (thay thế Grid).
   - **Biểu đồ Line Chart (Lai CSS/SVG)**: Hệ thống lưới, chấm tròn và chú thích (Legend) được vẽ chính xác 100% so với thiết kế Figma/Mockup của Sếp. Fix hoàn toàn lỗi méo ảnh hay kéo giãn trục.
   - **Bảng lịch sử Xuất/Nhập/Tồn**: Liệt kê chi tiết giao dịch theo các Ca bán hàng (Ca 1, Ca 2, Ca 3).

### B. Màn hình Nhập Bồn (NhapBon.js)
Quy trình thực tế:
- User chọn Bồn cần nhập hàng.
- Web hiển thị giao diện đối chiếu: Số liệu Tồn kho lúc bắt đầu vs Số thực tế từ Xe bồn.
- Chức năng Bơm và Đồng hồ đếm ngược được kích hoạt để mô phỏng quá trình bơm nhiên liệu vào bồn.
- Sau khi kết thúc, user có thể nhấn "Lưu phiếu nhập" để lưu dữ liệu.

## 4. Giao diện (UI/UX Logic)
- **Chế độ Sáng / Tối (Dark Mode)**: Hỗ trợ chuyển đổi toàn bộ màu sắc hệ thống dựa vào thư viện `next-themes` (Sử dụng class `dark:` của Tailwind).
- **Responsive**: Giao diện co giãn tốt với Layout chia cột, phù hợp với mọi kích thước màn hình hiển thị.
