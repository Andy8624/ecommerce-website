package com.dlk.ecommerce.domain.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(
        name = "messages",
        indexes = {
                @Index(name = "idx_receiver", columnList = "receiver_id"),
                @Index(name = "idx_sender_receiver", columnList = "sender_id, receiver_id"),
                @Index(name = "idx_created_at", columnList = "created_at"),
                @Index(name = "idx_is_read", columnList = "is_read")
        }
)
public class Message extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Column(nullable = false)
    private String text;

    @Column(nullable = false)
    private Boolean isRead = false;

}
