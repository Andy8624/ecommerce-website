package com.dlk.ecommerce.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.SQLDelete;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "tools")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Tool extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long toolId;

    @Column(nullable = false)
    @NotBlank(message = "Tool type name could not be blank")
    String name;

    @Column(columnDefinition = "MEDIUMTEXT")
    String description;

    // Tổng sản phẩm các loại
    int stockQuantity;
    String imageUrl;

    @Column(nullable = false)
    @NotNull(message = "Tool price could not be null")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    BigDecimal price;

    @Column(nullable = true)
    BigDecimal discountedPrice;

    @Column(nullable = false)
    boolean deleted = false;

    @Column(nullable = false, name = "is_active")
    boolean isActive = true;

    // Quản lý chi tiết sản phẩm
    boolean hidden = false;

    @ManyToOne
    @JoinColumn(name = "tool_type_id", nullable = false)
    ToolType toolType;

    // Thương hiệu
    String brand;
    // Xuất xứ
    String origin;
    // Thông tin bảo hành
    String warranty;
    Double length;
    Double width;
    Double height;
    Double weight;


    @OneToMany(mappedBy = "tool", fetch = FetchType.LAZY)
    @JsonIgnore
    List<OrderTool> orderTools;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
//    @JsonIgnore
    User user;

    @OneToMany(mappedBy = "tool", fetch = FetchType.LAZY)
    @JsonIgnore
    List<CartTool> cartTools;

    @OneToMany(mappedBy = "tool", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    List<ImageTool> imageTools;

    @OneToMany(mappedBy = "tool", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    List<ProductAttributes> attributes;

    @OneToMany(mappedBy = "tool", fetch = FetchType.LAZY)
    @JsonIgnore
    List<ProductReview> productReviews;

    @OneToMany(mappedBy = "tool", cascade = CascadeType.ALL, orphanRemoval = true)
    List<ProductVariant> variants = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "category_id") // Đảm bảo đúng với tên cột trong DB
    Category category;

//    // Thuộc tính lưu trữ điểm đánh giá trung bình của sản phẩm
//    Double averageRating = 0.0;
//    int totalRating = 0;
}
