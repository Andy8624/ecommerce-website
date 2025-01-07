package com.dlk.ct466.domain.mapper;

import com.dlk.ct466.domain.entity.RolePermission;
import com.dlk.ct466.domain.response.rolePermission.ResRoleOwnerDTO;
import com.dlk.ct466.domain.response.rolePermission.ResRolePermissionDTO;
import org.springframework.stereotype.Component;

@Component
public class RolePermissionMapper {

    public static ResRolePermissionDTO mapToResRolePermissionDTO(RolePermission rolePermission) {
        // Lấy thông tin từ role
        ResRolePermissionDTO.RoleInRolePermission role = new ResRolePermissionDTO.RoleInRolePermission();
        role.setRoleId(rolePermission.getRole().getRoleId());
        role.setName(rolePermission.getRole().getName());
        role.setActive(rolePermission.getRole().isActive());

        // Lấy thông tin từ permission
        ResRolePermissionDTO.PermissionInRolePermission permission = new ResRolePermissionDTO.PermissionInRolePermission();
        permission.setPermissionId(rolePermission.getPermission().getPermissionId());
        permission.setName(rolePermission.getPermission().getName());
        permission.setApiPath(rolePermission.getPermission().getApiPath());
        permission.setMethod(rolePermission.getPermission().getMethod());
        permission.setModule(rolePermission.getPermission().getModule());

        // Tạo và trả về ResRolePermissionDTO
        return ResRolePermissionDTO.builder()
                .id(rolePermission.getId())
                .role(role)
                .permission(permission)
                .build();
    }

    public static ResRoleOwnerDTO mapToResRoleOwnerDTO(RolePermission rolePermission) {
        // Lấy thông tin từ permission
        ResRoleOwnerDTO.PermissionInRolePermission permission = new ResRoleOwnerDTO.PermissionInRolePermission();
        permission.setPermissionId(rolePermission.getPermission().getPermissionId());
        permission.setName(rolePermission.getPermission().getName());
        permission.setApiPath(rolePermission.getPermission().getApiPath());
        permission.setMethod(rolePermission.getPermission().getMethod());
        permission.setModule(rolePermission.getPermission().getModule());

        // Tạo và trả về ResRolePermissionDTO
        return ResRoleOwnerDTO.builder()
                .permission(permission)
                .build();
    }
}
