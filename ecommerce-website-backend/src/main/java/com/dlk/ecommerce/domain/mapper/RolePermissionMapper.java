package com.dlk.ecommerce.domain.mapper;

import com.dlk.ecommerce.domain.entity.RolePermission;
import com.dlk.ecommerce.domain.response.rolePermission.ResRoleOwnerDTO;
import com.dlk.ecommerce.domain.response.rolePermission.ResRolePermissionDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;


@Mapper(componentModel = "spring")
public interface RolePermissionMapper {

    @Mapping(source = "id", target = "id")
    @Mapping(source = "role.roleId", target = "role.roleId")
    @Mapping(source = "role.name", target = "role.name")
    @Mapping(source = "role.active", target = "role.active")
    @Mapping(source = "permission.permissionId", target = "permission.permissionId")
    @Mapping(source = "permission.name", target = "permission.name")
    @Mapping(source = "permission.apiPath", target = "permission.apiPath")
    @Mapping(source = "permission.method", target = "permission.method")
    @Mapping(source = "permission.module", target = "permission.module")
    ResRolePermissionDTO mapToResRolePermissionDTO(RolePermission rolePermission);

    @Mapping(source = "permission.permissionId", target = "permission.permissionId")
    @Mapping(source = "permission.name", target = "permission.name")
    @Mapping(source = "permission.apiPath", target = "permission.apiPath")
    @Mapping(source = "permission.method", target = "permission.method")
    @Mapping(source = "permission.module", target = "permission.module")
    ResRoleOwnerDTO mapToResRoleOwnerDTO(RolePermission rolePermission);}
