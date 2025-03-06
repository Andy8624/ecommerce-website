package com.dlk.ecommerce.repository;

import com.dlk.ecommerce.domain.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, String> {
    @Query("SELECT m FROM Message m WHERE (m.sender.userId = :userId1 AND m.receiver.userId = :userId2) " +
            "OR (m.sender.userId = :userId2 AND m.receiver.userId = :userId1) ORDER BY m.createdAt ASC")
    List<Message> findMessagesBetweenUsers(@Param("userId1") String userId1, @Param("userId2") String userId2);
}
