package com.dlk.ecommerce.domain.response.user;

import com.dlk.ecommerce.domain.response.rolePermission.ResRoleOwnerDTO;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
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
    Instant createdAt;
    String createdBy;
    RoleInCreateUser role;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class RoleInCreateUser {
        long id;
        String name;
        List<ResRoleOwnerDTO> permissions;
    }
}
