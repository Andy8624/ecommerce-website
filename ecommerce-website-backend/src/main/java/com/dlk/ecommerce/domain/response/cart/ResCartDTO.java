package com.dlk.ecommerce.domain.response.cart;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ResCartDTO {
    String cartId;
    CartUser user;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    @Builder(toBuilder = true)
    public static class CartUser {
        String userId;
        String fullName;
        String email;
    }
}
