package com.dlk.ecommerce.domain.request.ghn;

import lombok.Data;

import java.util.List;

@Data
public class CalculateShippingCostRequest {
    Integer service_type_id = 2;
    String from_province;
    String from_district;
    String from_ward;
    String to_province;
    String to_district;
    String to_ward;

    Integer length;
    Integer width;
    Integer height;
    Integer weight;
    Integer insurance_value;
    List<OrderItemGHN> items;
}

//{
//    "service_type_id":5,
//    "from_district_id":1442,
//    "from_ward_code": "21211",
//    "to_district_id":1820,
//    "to_ward_code":"030712",
//    "length":30,
//    "width":40,
//    "height":20,
//    "weight":3000,
//    "insurance_value":0,
//    "coupon": null,
//    "items": [
//    {
//        "name": "TEST1",
//        "quantity": 1,
//        "length": 200,
//        "width": 200,
//        "height": 200,
//        "weight": 1000
//    }]
//}