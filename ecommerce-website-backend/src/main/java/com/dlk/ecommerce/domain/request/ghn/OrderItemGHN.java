package com.dlk.ecommerce.domain.request.ghn;

import lombok.Data;

@Data
public class OrderItemGHN {
    String name;
    Integer quantity;

    Integer length;
    Integer width;
    Integer height;
    Integer weight;
}
