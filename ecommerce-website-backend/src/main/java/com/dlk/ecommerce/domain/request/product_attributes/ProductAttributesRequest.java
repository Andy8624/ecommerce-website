package com.dlk.ecommerce.domain.request.product_attributes;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductAttributesRequest {
    private Long toolId;
    private Map<String, String> attributes;
}
