package com.dlk.ct466.domain.response.user;


import com.dlk.ct466.domain.entity.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

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

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder(toBuilder = true)
    public static class UserRole {
        private long roleId;
        private String name;
    }
}
