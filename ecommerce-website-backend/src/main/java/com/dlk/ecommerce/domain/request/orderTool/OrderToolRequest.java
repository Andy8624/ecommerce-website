package com.dlk.ecommerce.domain.request.orderTool;

import com.dlk.ecommerce.domain.entity.Tool;
import com.dlk.ecommerce.domain.entity.User;
import com.dlk.ecommerce.domain.response.productvariant.VariantDetailResponse;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderToolRequest {
    String name;
    BigDecimal price;
    int quantity;
    Integer toolId;
    VariantDetailResponse variantDetail1;
    VariantDetailResponse variantDetail2;
//    User ownerUser;
    Long id; // cartToolId
}
