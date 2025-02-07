package com.dlk.ecommerce.domain.request.ghn;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class GetProvinceIDRequest {
    private String provinceName;
}
