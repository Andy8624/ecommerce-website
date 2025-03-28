package com.dlk.ecommerce.domain.response.user;

import com.dlk.ecommerce.domain.entity.Role;
import com.dlk.ecommerce.domain.response.rolePermission.ResRoleOwnerDTO;
import com.dlk.ecommerce.util.constant.Gender;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ResCreateUserDTO {
    String userId;
    String fullName;
    String email;
    String accessToken;
    boolean isActive = true;
    String imageUrl;
    LocalDate birthdate;
    Instant createdAt;
    String createdBy;
    Role role;
    String phone;
    Gender gender;
}
