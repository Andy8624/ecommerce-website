package com.dlk.ecommerce.repository;

import com.dlk.ecommerce.domain.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long>, JpaSpecificationExecutor<Role> {
    boolean existsByName(String name);

    @Query("SELECT r FROM Role r WHERE r.roleId = :id AND r.deleted = false")
    Optional<Role> findByIdNotDeleted(@Param("id") long id);

    Role findByName(String name);
}
