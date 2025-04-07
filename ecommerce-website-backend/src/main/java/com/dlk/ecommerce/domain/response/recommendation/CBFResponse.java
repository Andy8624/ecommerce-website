package com.dlk.ecommerce.domain.response.recommendation;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CBFResponse {
    Long toolId;
    String name;
    String description;
    String toolType;
    String brand;
    String imageUrl;
    BigDecimal price;
}
