package com.dlk.ct466.repository;

import com.dlk.ct466.domain.entity.ToolType;
import com.dlk.ct466.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String>,
        JpaSpecificationExecutor<User> {
    @Query("SELECT u FROM User u WHERE u.userId = :id AND u.deleted = false")
    Optional<User> findByIdIfNotDeleted(@Param("id") String id);

    @Query("SELECT u FROM User u WHERE u.email = :email AND u.deleted = false")
    Optional<User> findByEmailNotDeleted(@Param("email") String email);

    Optional<User> findByRefreshTokenAndEmail(String token, String email);

    Optional<User> findByEmail(String email);

    Optional<User> findByUserId(String id);
}
