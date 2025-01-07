package com.dlk.ct466.service;

import com.dlk.ct466.domain.entity.Permission;
import com.dlk.ct466.domain.response.ResPaginationDTO;
import com.dlk.ct466.repository.PermissionRepository;
import com.dlk.ct466.util.PaginationUtil;
import com.dlk.ct466.util.error.IdInvalidException;
import com.turkraft.springfilter.converter.FilterSpecification;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;
import com.turkraft.springfilter.parser.FilterParser;
import com.turkraft.springfilter.parser.node.FilterNode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PermissionService {
    private final PermissionRepository permissionRepository;
    private final FilterParser filterParser;
    private final FilterSpecificationConverter filterSpecificationConverter;

    public boolean isPermissionExist(Permission p) {
        return permissionRepository.existsByModuleAndApiPathAndMethod(
                p.getModule(),
                p.getApiPath(),
                p.getMethod());
    }

    public boolean isSameName(String name, long id) throws IdInvalidException {
        Permission permissionDB = fetchById(id);
        return permissionDB.getName().equals(name);
    }

    public Permission fetchByIdAdmin(long id) throws IdInvalidException {
        return permissionRepository.findById(id).orElseThrow(
                () -> new IdInvalidException("Permission with id: " + id + " not found")
        );
    }

    public Permission fetchById(long id) throws IdInvalidException {
        return permissionRepository.findByIdNotDeleted(id).orElseThrow(
                () -> new IdInvalidException("Permission with id: " + id + " not found")
        );
    }

    public Permission createPermission(Permission p) throws IdInvalidException {
        if (isPermissionExist(p)) {
            throw new IdInvalidException("Permission already exits");
        }
        return permissionRepository.save(p);
    }

    public Permission update(Permission permissionUpdate, long id) throws IdInvalidException {
        Permission dbPermission = fetchById(id);

        if (isPermissionExist(permissionUpdate)) {
            if (isSameName(permissionUpdate.getName(), id)) {
                throw new IdInvalidException("Permission already exits");
            }
        }

        dbPermission.setName(permissionUpdate.getName());
        dbPermission.setApiPath(permissionUpdate.getApiPath());
        dbPermission.setMethod(permissionUpdate.getMethod());
        dbPermission.setModule(permissionUpdate.getModule());

        // update
        dbPermission = permissionRepository.save(dbPermission);
        return dbPermission;
    }


    public Void delete(long id) throws IdInvalidException {
        Permission dbPermission = fetchById(id).toBuilder().deleted(true).build();
        permissionRepository.save(dbPermission);
        return null;
    }

    public Void restore(long id) throws IdInvalidException {
        Permission dbPermission = fetchByIdAdmin(id).toBuilder().deleted(false).build();
        permissionRepository.save(dbPermission);
        return null;
    }

    public ResPaginationDTO getAllPermission(Pageable pageable) {

        FilterNode node = filterParser.parse("deleted=false");
        FilterSpecification<Permission> spec = filterSpecificationConverter.convert(node);

        Page<Permission> pagePermission = permissionRepository.findAll(spec, pageable);
        return PaginationUtil.getPaginatedResult(pagePermission, pageable);
    }

    public ResPaginationDTO getAllPermissionAdmin(Pageable pageable) {
        Page<Permission> pagePermission = permissionRepository.findAll(pageable);
        return PaginationUtil.getPaginatedResult(pagePermission, pageable);
    }
}
