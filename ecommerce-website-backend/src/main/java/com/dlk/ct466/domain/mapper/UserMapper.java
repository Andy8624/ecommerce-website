package com.dlk.ct466.domain.mapper;

import com.dlk.ct466.domain.entity.Permission;
import com.dlk.ct466.domain.entity.Role;
import com.dlk.ct466.domain.entity.User;
import com.dlk.ct466.domain.response.rolePermission.ResRoleOwnerDTO;
import com.dlk.ct466.domain.response.user.ResCreateUserDTO;
import com.dlk.ct466.domain.response.user.ResUpdateUserDTO;
import com.dlk.ct466.domain.response.user.ResUserDTO;
import com.dlk.ct466.service.RolePermissionService;
import com.dlk.ct466.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserMapper {
    private final RolePermissionService rolePermissionService;

    public UserMapper(RolePermissionService rolePermissionService) {
        this.rolePermissionService = rolePermissionService;
    }

    public ResCreateUserDTO mapToCreateUserDTO(User user) {
        List<ResRoleOwnerDTO> permissions = rolePermissionService.getPermissionsByRoleId(user.getRole().getRoleId());
        ResCreateUserDTO.RoleInCreateUser role = new ResCreateUserDTO.RoleInCreateUser();
        if (user.getRole() != null) {
            role.setId(user.getRole().getRoleId());
            role.setName(user.getRole().getName());
            role.setPermissions(permissions);
        }

        return ResCreateUserDTO.builder()
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .isActive(user.isActive())
                .imageUrl(user.getImageUrl())
                .createdAt(user.getCreatedAt())
                .createdBy(user.getCreatedBy())
                .role(role)
                .build();
    }

    public static ResUpdateUserDTO mapToUpdateUserDTO(User user) {
        return ResUpdateUserDTO.builder()
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .isActive(user.isActive())
                .imageUrl(user.getImageUrl())
                .updatedAt(user.getUpdatedAt())
                .updatedBy(user.getUpdatedBy())
                .build();
    }

    public static ResUserDTO mapToUserDTO(User user) {
        ResUserDTO.UserRole userRole = null;

        if (user.getRole() != null) {
            userRole = new ResUserDTO.UserRole().toBuilder()
                    .roleId(user.getRole().getRoleId())
                    .name(user.getRole().getName())
                    .build();
        }
        return ResUserDTO.builder()
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .isActive(user.isActive())
                .imageUrl(user.getImageUrl())
                .createdAt(user.getCreatedAt())
                .createdBy(user.getCreatedBy())
                .updatedAt(user.getUpdatedAt())
                .updatedBy(user.getUpdatedBy())
                .role(userRole)
                .build();
    }
}
