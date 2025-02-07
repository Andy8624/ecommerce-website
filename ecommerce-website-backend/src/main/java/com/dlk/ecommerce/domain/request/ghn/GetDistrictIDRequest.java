package com.dlk.ecommerce.domain.request.ghn;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GetDistrictIDRequest {
    private String provinceName;
    private String districtName;
}
