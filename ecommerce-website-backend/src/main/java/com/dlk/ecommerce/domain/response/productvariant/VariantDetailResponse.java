package com.dlk.ecommerce.domain.response.productvariant;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class VariantDetailResponse {
    private String id;
    private String product_variant_id;
    private BigDecimal price;
    private Integer stock;

    private String category_detail_id;
    private String category_detail_name;
    private String category_name;

}
