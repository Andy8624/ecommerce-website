package com.dlk.ecommerce.domain.response.address;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResAddressDTO {
    String addressId;
    String street;
    String ward;
    String district;
    String city;
    Instant createdAt;
    String createdBy;
    Instant updatedAt;
    String updatedBy;
}
