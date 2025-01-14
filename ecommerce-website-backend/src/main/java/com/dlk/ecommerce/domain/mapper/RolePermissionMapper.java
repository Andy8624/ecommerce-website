package com.dlk.ecommerce.domain.mapper;

import com.dlk.ecommerce.domain.entity.RolePermission;
import com.dlk.ecommerce.domain.response.rolePermission.ResRoleOwnerDTO;
import com.dlk.ecommerce.domain.response.rolePermission.ResRolePermissionDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;


@Mapper(componentModel = "spring")
public interface RolePermissionMapper {
    ResRolePermissionDTO mapToResRolePermissionDTO(RolePermission rolePermission);

    ResRoleOwnerDTO mapToResRoleOwnerDTO(RolePermission rolePermission);}
