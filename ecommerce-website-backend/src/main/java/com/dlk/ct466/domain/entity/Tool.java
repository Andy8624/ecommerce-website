package com.dlk.ct466.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.SQLDelete;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "tools")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
@SQLDelete(sql = "UPDATE tools SET deleted = true WHERE tool_id = ?")
public class Tool extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long toolId;

    @Column(nullable = false)
    @NotBlank(message = "Tool type name could not be blank")
    String name;

    @Column(columnDefinition = "MEDIUMTEXT")
    String description;


    int stockQuantity;
    String imageUrl;

    @Column(nullable = false)
    @NotNull(message = "Tool price could not be null")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    BigDecimal price;

    @DecimalMin(value = "0.0", message = "Discounted price must be greater than 0")
    BigDecimal discountedPrice;

    @Column(nullable = false)
    boolean deleted = false;

    @Column(nullable = false)
    boolean isActive = true;

    @ManyToOne
    @JoinColumn(name = "tool_type_id", nullable = false)
    ToolType toolType;

    @OneToMany(mappedBy = "tool", fetch = FetchType.LAZY)
    @JsonIgnore
    List<OrderTool> orderTools;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    User user;

    @OneToMany(mappedBy = "tool", fetch = FetchType.LAZY)
    @JsonIgnore
    List<CartTool> cartTools;

    @OneToMany(mappedBy = "tool", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    List<ImageTool> imageTools;

}
