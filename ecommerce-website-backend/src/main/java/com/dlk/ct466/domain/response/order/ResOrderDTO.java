package com.dlk.ct466.domain.response.order;

import com.dlk.ct466.domain.entity.User;
import com.dlk.ct466.util.constant.OrderStatusEnum;
import com.dlk.ct466.util.constant.OrderType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ResOrderDTO {
    String orderId;
    BigDecimal shippingCost;
    OrderStatusEnum status;
    UserOrder user;
    AddressOrder address;
    PaymentMethodOrder paymentMethod;
    Instant createdAt;
    String createdBy;
    Instant updatedAt;
    String updatedBy;
    OrderType type;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserOrder {
        private String id;
        private String fullName;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddressOrder {
        private String id;
        private String address;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentMethodOrder {
        private long id;
        private String name;
    }

}
