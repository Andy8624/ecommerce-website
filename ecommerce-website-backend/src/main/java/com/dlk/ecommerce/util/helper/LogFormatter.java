package com.dlk.ecommerce.util.helper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class LogFormatter {
    public static void logFormattedRequest(Object request) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String formattedJson = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(request);
            log.info("Request:\n{}", formattedJson);
        } catch (JsonProcessingException e) {
            log.error("Error formatting request: {}", e.getMessage());
        }
    }
}
