package com.dlk.ecommerce.domain.request.auth;

import lombok.Data;

@Data
public class LogoutRequest {
    String old_access_token;
    String device_id;
}
