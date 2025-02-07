package com.dlk.ecommerce.domain.response.user;

import com.dlk.ecommerce.util.constant.Gender;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ResUpdateUserDTO {
    String userId;
    String fullName;
    String phone;
    LocalDate birthdate;
    boolean isActive = true;
    String imageUrl;
    Gender gender;
    Instant updatedAt;
    String updatedBy;

    String shopId;
    // Địa chỉ nhận hàng (địa chỉ cửa hàng)
    String shopAddressId;
    String businessType;
    // Địa chỉ đăng ký kinh doanh
    String businessAddress;
    String billingEmail;
    String taxNumber;
    String shopName;

}
