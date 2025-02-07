package com.dlk.ecommerce.domain.response.user;


import com.dlk.ecommerce.util.constant.Gender;
import jakarta.persistence.Column;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ResUserDTO {
    String userId;
    String fullName;
    String email;
    boolean isActive = true;
    String imageUrl;
    UserRole role;
    Instant createdAt;
    Instant updatedAt;
    String createdBy;
    String updatedBy;
    String phone;
    LocalDate birthdate;
    Gender gender;

    String shopId = null;
    // Địa chỉ nhận hàng (địa chỉ cửa hàng)
    String shopAddressId = null;
    String businessType = null;
    // Địa chỉ đăng ký kinh doanh
    String businessAddress = null;
    String billingEmail = null;
    String taxNumber = null;
    String shopName = null;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder(toBuilder = true)
    public static class UserRole {
        private long roleId;
        private String name;
    }
}
