package com.dlk.ecommerce.domain.request.ghn;

import lombok.Data;
import java.util.List;

@Data
public class ReqCalculateShippingCost {

    private int service_type_id;
    private int from_district_id;
    private String from_ward_code;
    private int to_district_id;
    private String to_ward_code;
    private int length;
    private int width;
    private int height;
    private int weight;
    private int insurance_value;
    private String coupon;
    private List<Items> items;

    @Data
    public static class Items {
        private String name;
        private int quantity;
        private int length;
        private int width;
        private int height;
        private int weight;
    }
}
