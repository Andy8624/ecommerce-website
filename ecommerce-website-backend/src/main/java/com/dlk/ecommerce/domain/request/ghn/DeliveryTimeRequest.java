package com.dlk.ecommerce.domain.request.ghn;

import lombok.Data;

@Data
public class DeliveryTimeRequest {
    String from_province;
    String from_district;
    String from_ward;
    String to_province;
    String to_district;
    String to_ward;
}