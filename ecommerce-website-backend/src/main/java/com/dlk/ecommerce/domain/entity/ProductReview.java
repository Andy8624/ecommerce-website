package com.dlk.ecommerce.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "product_review",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "tool_id"})})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductReview extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    // Mỗi review thuộc về một User, và 1 user có thể có nhiều review.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    // Mỗi review thuộc về một sản phẩm (Tool), và 1 sản phẩm có thể có nhiều review.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tool_id", nullable = false)
    Tool tool;

    // Điểm đánh giá (ví dụ từ 1 đến 5)
    @NotNull(message = "Rating cannot be null")
    Integer rating;

    // Bình luận của người dùng (có thể là TEXT, cho phép comment dài)
    @Column(columnDefinition = "TEXT")
    String buyerReview;

    @Column(columnDefinition = "TEXT")
    String shopAnswer;

    // Danh sách tên các ảnh được cách nhau bởi dấu phẩy (,). Ví dụ: "image1.jpg,image2.jpg"
    String imageUrls;
}
