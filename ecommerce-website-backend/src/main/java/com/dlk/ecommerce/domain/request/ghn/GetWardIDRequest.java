package com.dlk.ecommerce.domain.request.ghn;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GetWardIDRequest {
    private String provinceName;
    private String districtName;
    private String wardName;
}
