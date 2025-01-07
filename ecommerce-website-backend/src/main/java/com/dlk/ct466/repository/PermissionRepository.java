package com.dlk.ct466.repository;
import com.dlk.ct466.domain.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long>,
        JpaSpecificationExecutor<Permission> {
    boolean existsByModuleAndApiPathAndMethod(String module, String apiPath, String method);

    @Query("SELECT p FROM Permission p WHERE p.permissionId = :id AND p.deleted = false")
    Optional<Permission> findByIdNotDeleted(@Param("id") long id);

    Permission findByName(String name);
}
