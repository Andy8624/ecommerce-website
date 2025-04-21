package com.dlk.ecommerce.domain.request.ghn;

import java.util.List;

import com.dlk.ecommerce.util.constant.RequireNoteGHN;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import static lombok.AccessLevel.PRIVATE;

@Data
@FieldDefaults(level = PRIVATE) // Mặc định tất cả các trường là private
public class ReqCreateOrderGHN {

    @NotNull(message = "payment_type_id is required")
    int payment_type_id = 2;           // Loại hình thanh toán (1: Shop trả phí, 2: Người nhận trả phí)

    String note;                       // Ghi chú đơn hàng

    @Enumerated(EnumType.STRING)       // Lưu enum dưới dạng chuỗi trong cơ sở dữ liệu
    @NotNull(message = "required_note is required")
    RequireNoteGHN required_note;      // Ghi chú bắt buộc (ví dụ: CHOTHUHANG, KHONGCHOXEMHANG)

    String return_phone;               // Số điện thoại trả hàng khi không giao được
    String return_address;             // Địa chỉ trả hàng
    Integer return_district_id;        // ID quận/huyện trả hàng (có thể null)
    String return_ward_code;           // Mã phường trả hàng (có thể rỗng)
    String client_order_code;          // Mã đơn hàng từ client (nếu có)

    @NotNull(message = "from_name is required")
    String from_name;                  // Tên người gửi

    @NotNull(message = "from_phone is required")
    String from_phone;                 // Số điện thoại người gửi

    @NotNull(message = "from_address is required")
    String from_address;               // Địa chỉ người gửi

    @NotNull(message = "from_ward_name is required")
    String from_ward_name;             // Phường người gửi

    @NotNull(message = "from_district_name is required")
    String from_district_name;         // Quận/Huyện người gửi

    @NotNull(message = "from_province_name is required")
    String from_province_name;         // Tỉnh/Thành phố người gửi

    @NotNull(message = "to_name is required")
    String to_name;                    // Tên người nhận

    @NotNull(message = "to_phone is required")
    String to_phone;                   // Số điện thoại người nhận

    @NotNull(message = "to_address is required")
    String to_address;                 // Địa chỉ người nhận

    @NotNull(message = "to_ward_name is required")
    String to_ward_name;               // Phường người nhận

    @NotNull(message = "to_district_name is required")
    String to_district_name;           // Quận/Huyện người nhận

    @NotNull(message = "to_province_name is required")
    String to_province_name;           // Tỉnh/Thành phố người nhận

    int cod_amount = 0;                // Số tiền thu hộ (COD), mặc định là 0 nếu không có
    String content;                    // Nội dung đơn hàng

    @NotNull(message = "length is required")
    int length;                        // Chiều dài kiện hàng

    @NotNull(message = "width is required")
    int width;                         // Chiều rộng kiện hàng

    @NotNull(message = "height is required")
    int height;                        // Chiều cao kiện hàng

    @NotNull(message = "weight is required")
    int weight;                        // Cân nặng kiện hàng

    int cod_failed_amount = 0;         // Số tiền COD khi giao thất bại, mặc định là 0
    Integer pick_station_id;           // ID bưu cục lấy hàng (có thể null)
    Integer deliver_station_id;        // ID bưu cục giao hàng (có thể null)

    @NotNull(message = "insurance_value is required")
    int insurance_value;               // Giá trị bảo hiểm

    @NotNull(message = "service_type_id is required")
    int service_type_id = 2;               // Loại dịch vụ vận chuyển

    String coupon;                     // Mã giảm giá (nếu có)

    @NotNull(message = "pickup_time is required")
    long pickup_time;                  // Thời gian lấy hàng (timestamp)

    @NotNull(message = "pick_shift is required")
    List<Integer> pick_shift;          // Danh sách ca lấy hàng

    @NotNull(message = "items is required")
    List<Item> items;                  // Danh sách sản phẩm trong đơn hàng

    @Data
    @FieldDefaults(level = PRIVATE)
    public static class Item {
        @NotNull(message = "name is required")
        String name;                   // Tên sản phẩm

        String code;                   // Mã sản phẩm

        @NotNull(message = "quantity is required")
        int quantity;                  // Số lượng

        @NotNull(message = "price is required")
        int price;                     // Giá sản phẩm

        @NotNull(message = "length is required for item")
        int length;                    // Chiều dài sản phẩm

        @NotNull(message = "width is required for item")
        int width;                     // Chiều rộng sản phẩm

        @NotNull(message = "height is required for item")
        int height;                    // Chiều cao sản phẩm

        @NotNull(message = "weight is required for item")
        int weight;                    // Cân nặng sản phẩm

        @NotNull(message = "category is required for item")
        Category category;             // Danh mục sản phẩm

        @Data
        @FieldDefaults(level = PRIVATE)
        public static class Category {
            @NotNull(message = "level1 is required for category")
            String level1;             // Cấp 1 của danh mục sản phẩm
            String level2;             // Cấp 2 của danh mục sản phẩm
            String level3;             // Cấp 3 của danh mục sản phẩm
        }
    }
}
