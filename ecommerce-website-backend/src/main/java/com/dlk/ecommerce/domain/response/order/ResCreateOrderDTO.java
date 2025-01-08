package com.dlk.ecommerce.domain.response.order;

import com.dlk.ecommerce.util.constant.OrderStatusEnum;
import com.dlk.ecommerce.util.constant.OrderType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ResCreateOrderDTO {
    String orderId;
    BigDecimal shippingCost;
    OrderStatusEnum status;
    UserOrder user;
    AddressOrder address;
    PaymentMethodOrder paymentMethod;
    Instant createdAt;
    String createdBy;
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
