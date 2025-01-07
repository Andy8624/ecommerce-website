package com.dlk.ct466.domain.response.rolePermission;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ResRolePermissionDTO {
    long id;
    RoleInRolePermission role;
    PermissionInRolePermission permission;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class RoleInRolePermission {
        long roleId;
        String name;
        boolean active;
    }

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
