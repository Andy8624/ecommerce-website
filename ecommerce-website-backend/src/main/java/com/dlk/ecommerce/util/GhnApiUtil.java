package com.dlk.ecommerce.util;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * Utility class for interacting with GHN API.
 */
@Component
public class GhnApiUtil {

    @Value("${ghn.api-url}")
    private String apiUrl;

    @Value("${ghn.token}")
    private String token;

    private final RestTemplate restTemplate;

    public GhnApiUtil(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Creates HTTP headers with required authentication token and content type.
     *
     * @return HttpHeaders object.
     */
    public HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("token", token);
        headers.set("Content-Type", "application/json");
        return headers;
    }

    /**
     * Calls GHN API with the specified endpoint, HTTP method, and request body.
     *
     * @param endpoint API endpoint.
     * @param method HTTP method (GET, POST, etc.).
     * @param body Request body.
     * @return Response data from GHN API.
     */
    public Object callGhnApi(String endpoint, HttpMethod method, Object body) {
        String url = apiUrl + endpoint;
        HttpHeaders headers = createHeaders();
        HttpEntity<Object> requestEntity = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.exchange(url, method, requestEntity, Map.class);
        return response.getBody().get("data");
    }
}