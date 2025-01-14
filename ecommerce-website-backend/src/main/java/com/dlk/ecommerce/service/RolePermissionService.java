package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.Permission;
import com.dlk.ecommerce.domain.entity.Role;
import com.dlk.ecommerce.domain.entity.RolePermission;
import com.dlk.ecommerce.domain.mapper.RolePermissionMapper;
import com.dlk.ecommerce.domain.response.ResPaginationDTO;
import com.dlk.ecommerce.domain.response.rolePermission.ResRoleOwnerDTO;
import com.dlk.ecommerce.domain.response.rolePermission.ResRolePermissionDTO;
import com.dlk.ecommerce.repository.RolePermissionRepository;
import com.dlk.ecommerce.util.PaginationUtil;
import com.dlk.ecommerce.util.error.IdInvalidException;
import com.turkraft.springfilter.converter.FilterSpecification;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;
import com.turkraft.springfilter.parser.FilterParser;
import com.turkraft.springfilter.parser.node.FilterNode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RolePermissionService {
    private final RolePermissionRepository rolePermissionRepository;
    private final RoleService roleService;
    private final PermissionService permissionService;
    private final FilterParser filterParser;
    private final FilterSpecificationConverter filterSpecificationConverter;
    private final RolePermissionMapper rolePermissionMapper;

    public RolePermission fetchById(long id) throws IdInvalidException {
        return rolePermissionRepository.findByIdNotDeleted(id).orElseThrow(
                () -> new IdInvalidException("RolePermission with id: " + id + " not found")
        );
    }

    public ResRolePermissionDTO fetchByIdDTO(long id) throws IdInvalidException {
        RolePermission rolePermission = fetchById(id);
        return rolePermissionMapper.mapToResRolePermissionDTO(rolePermission);
    }

    public RolePermission createRolePermission(RolePermission rolePermission) throws IdInvalidException {
        Role dbRole = roleService.fetchById(rolePermission.getRole().getRoleId());
        Permission dbPermission = permissionService.fetchById(rolePermission.getPermission().getPermissionId());
        if (rolePermissionRepository.existsByRoleAndPermission(dbRole, dbPermission)) {
            throw new IdInvalidException("RolePermission already exists");
        }
        rolePermission.setPermission(dbPermission);
        rolePermission.setRole(dbRole);
        return rolePermissionRepository.save(rolePermission);
    }

    public RolePermission update(RolePermission rolePermissionUpdate, long id) throws IdInvalidException {
        RolePermission dbRolePermission = fetchById(id);

        dbRolePermission.setRole(rolePermissionUpdate.getRole());
        dbRolePermission.setPermission(rolePermissionUpdate.getPermission());

        return rolePermissionRepository.save(dbRolePermission);
    }

    public Void delete(long id) throws IdInvalidException {
        RolePermission dbRolePermission = fetchById(id).toBuilder().deleted(true).build();
        rolePermissionRepository.save(dbRolePermission);
        return null;
    }

    public Void restore(long id) throws IdInvalidException {
        RolePermission dbRolePermission = rolePermissionRepository.findById(id)
                .orElseThrow(() -> new IdInvalidException("RolePermission with id: " + id + " not found"));
        dbRolePermission.setDeleted(false);
        rolePermissionRepository.save(dbRolePermission);
        return null;
    }

    public ResPaginationDTO getAllRolePermissions(Pageable pageable) {

        FilterNode node = filterParser.parse("deleted=false");
        FilterSpecification<RolePermission> spec = filterSpecificationConverter.convert(node);

        Page<RolePermission> pageRolePermissions = rolePermissionRepository.findAll(spec, pageable);
        return PaginationUtil.getPaginatedResult(pageRolePermissions, pageable, rolePermissionMapper::mapToResRolePermissionDTO);
    }

    public ResPaginationDTO getPermissionsByRoleIdDTO(long roleId, Pageable pageable) {
        FilterNode node = filterParser.parse("deleted=false and role.id=" + roleId);
        FilterSpecification<RolePermission> spec = filterSpecificationConverter.convert(node);
        Page<RolePermission> pageRolePermissions = rolePermissionRepository.findAll(spec, pageable);
        return PaginationUtil.getPaginatedResult(pageRolePermissions, pageable, rolePermissionMapper::mapToResRoleOwnerDTO);
    }

    public List<ResRoleOwnerDTO> getPermissionsByRoleId(long roleId) {
        FilterNode node = filterParser.parse("deleted=false and role.id=" + roleId);
        FilterSpecification<RolePermission> spec = filterSpecificationConverter.convert(node);

        List<RolePermission> rolePermissions = rolePermissionRepository.findAll(spec);

        return rolePermissions.stream()
                .map(rolePermissionMapper::mapToResRoleOwnerDTO)
                .collect(Collectors.toList());
    }

}
