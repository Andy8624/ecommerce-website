package com.dlk.ct466.service;

import com.dlk.ct466.domain.entity.Role;
import com.dlk.ct466.domain.response.ResPaginationDTO;
import com.dlk.ct466.repository.RoleRepository;
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
public class RoleService {
    private final RoleRepository roleRepository;
    private final FilterParser filterParser;
    private final FilterSpecificationConverter filterSpecificationConverter;

    public boolean isRoleExist(String name) {
        return roleRepository.existsByName(name);
    }

    public Role fetchById(long id) throws IdInvalidException {
        return roleRepository.findByIdNotDeleted(id).orElseThrow(
                () -> new IdInvalidException("Role with id: " + id + " not found")
        );
    }

    public Role createRole(Role role) throws IdInvalidException {
        if (isRoleExist(role.getName())) {
            throw new IdInvalidException("Role already exists");
        }
        return roleRepository.save(role);
    }

    public Role update(Role roleUpdate, long id) throws IdInvalidException {
        Role dbRole = fetchById(id);

        if (isRoleExist(roleUpdate.getName()) && !dbRole.getName().equals(roleUpdate.getName())) {
            throw new IdInvalidException("Role with the same name already exists");
        }

        dbRole.setName(roleUpdate.getName());
        dbRole.setDescription(roleUpdate.getDescription());
        dbRole.setActive(roleUpdate.isActive());

        dbRole = roleRepository.save(dbRole);
        return dbRole;
    }

    public Void delete(long id) throws IdInvalidException {
        Role dbRole = fetchById(id).toBuilder().deleted(true).build();
        roleRepository.save(dbRole);
        return null;
    }

    public Void restore(long id) throws IdInvalidException {
        Role dbRole = roleRepository.findById(id).orElseThrow(
                () -> new IdInvalidException("Role with id: " + id + " not found")
        ).toBuilder().deleted(false).build();
        roleRepository.save(dbRole);
        return null;
    }

    public ResPaginationDTO getAllRoles(Pageable pageable) {
        FilterNode node = filterParser.parse("deleted=false");
        FilterSpecification<Role> spec = filterSpecificationConverter.convert(node);

        Page<Role> pageRole = roleRepository.findAll(spec, pageable);
        return PaginationUtil.getPaginatedResult(pageRole, pageable);
    }

}
