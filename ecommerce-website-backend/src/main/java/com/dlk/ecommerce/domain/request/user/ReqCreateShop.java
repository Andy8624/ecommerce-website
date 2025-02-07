package com.dlk.ecommerce.domain.request.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder(toBuilder = true)
public class ReqCreateShop {
    private Integer district_id;
    private String ward_code;
    private String name;
    private String phone;
    private String address;
}
