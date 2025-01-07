
package com.dlk.ct466.domain.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

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

    @Column(nullable = false)
    @NotNull(message = "Quantity could not be null")
    @Min(value = 1, message = "Quantity must be at least 1")
    int quantity;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
            @JsonIgnore
    Order order;

    @ManyToOne
    @JoinColumn(name = "tool_id", nullable = false)
    Tool tool;
}