package com.dlk.ecommerce.domain.request.category;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDetailRequest {
    String categoryId0;
    String categoryId1;
    String category0;
    String category1;
    BigDecimal price;
    Integer stock;
}
