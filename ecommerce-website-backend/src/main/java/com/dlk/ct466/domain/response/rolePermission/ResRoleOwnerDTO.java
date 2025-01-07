package com.dlk.ct466.domain.response.rolePermission;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ResRoleOwnerDTO {
    PermissionInRolePermission permission;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class PermissionInRolePermission {
        long permissionId;
        String name;
        String apiPath;
        String method;
        String module;
    }
}
