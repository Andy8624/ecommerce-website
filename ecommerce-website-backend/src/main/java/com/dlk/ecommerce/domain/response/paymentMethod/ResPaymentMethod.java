package com.dlk.ecommerce.domain.response.paymentMethod;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ResPaymentMethod {
    long paymentMethodId;
    String name;
    boolean isActive;
    boolean deleted;
}
