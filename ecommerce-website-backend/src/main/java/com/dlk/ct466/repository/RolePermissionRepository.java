package com.dlk.ct466.repository;

import com.dlk.ct466.domain.entity.Permission;
import com.dlk.ct466.domain.entity.Role;
import com.dlk.ct466.domain.entity.RolePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, Long>, JpaSpecificationExecutor<RolePermission> {

    @Query("SELECT rp FROM RolePermission rp WHERE rp.id = :id AND rp.deleted = false")
    Optional<RolePermission> findByIdNotDeleted(@Param("id") long id);

    boolean existsByRoleAndPermission(Role role, Permission permission);
}
