package com.dlk.ecommerce.repository;

import com.dlk.ecommerce.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
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

    boolean existsByPhone(String phone);

    boolean existsByShopName(String shopName);

    List<User> findAllByOnlineTrue();

    @Query("SELECT COUNT(t) FROM Tool t WHERE t.user.userId = :userId AND t.deleted = false")
    Long countToolsByUserId(@Param("userId") String userId);

    @Query("SELECT SUM(ot.quantity) FROM OrderTool ot JOIN ot.tool t WHERE t.user.userId = :userId AND ot.order" +
            ".status IN ('COMPLETED', 'DELIVERED')")
    Long countSoldProductsByUserId(@Param("userId") String userId);

    @Query("SELECT COUNT(pr) FROM ProductReview pr JOIN pr.tool t WHERE t.user.userId = :userId")
    Long countProductReviewsByShopId(@Param("userId") String userId);
}


