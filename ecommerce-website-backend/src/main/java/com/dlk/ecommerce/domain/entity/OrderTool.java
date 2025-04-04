
package com.dlk.ecommerce.domain.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Entity
@Table(name = "order_tools")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderTool extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String orderToolId;

    String name;
    BigDecimal price;

    @Column(nullable = false)
    @NotNull(message = "Quantity could not be null")
    @Min(value = 1, message = "Quantity must be at least 1")
    int quantity;

    String variantDetailId1;
    String product_variant_id_1;
    String category_detail_id_1;
    String category_name_1;
    String category_detail_name_1;

    String variantDetailId2;
    String product_variant_id_2;
    String category_detail_id_2;
    String category_name_2;
    String category_detail_name_2;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
            @JsonIgnore
    Order order;

    @ManyToOne
    @JoinColumn(name = "tool_id", nullable = false)
    Tool tool;
}