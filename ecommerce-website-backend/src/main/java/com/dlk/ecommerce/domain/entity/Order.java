package com.dlk.ecommerce.domain.entity;

import com.dlk.ecommerce.util.constant.OrderStatusEnum;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Order extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String orderId;

    @Column(nullable = false)
    @NotNull(message = "Shipping cost could not be null")
    @DecimalMin(value = "0.0", message = "Shipping cost must be greater than 0")
    BigDecimal shippingCost;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    OrderStatusEnum status;

    String shopId;

    @Builder.Default
    Boolean rated = false;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @ManyToOne
    @JoinColumn(name = "payment_method_id")
    PaymentMethod paymentMethod;

    @ManyToOne
    @JoinColumn(name = "address_id")
    Address address;

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
    List<OrderTool> orderTools;
}
