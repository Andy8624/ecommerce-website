package com.dlk.ecommerce.util.helper;

import com.dlk.ecommerce.util.constant.Gender;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;

@Slf4j
public class LogFormatter {
    public static void logFormattedRequest(String message, Object request) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            SimpleModule module = new SimpleModule();
            module.addDeserializer(Gender.class, new GenderDeserializer());
            objectMapper.registerModule(module);

            String formattedJson = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(request);
            log.info("{}:\n{}", message, formattedJson);
        } catch (JsonProcessingException e) {
            log.error("Error formatting request: {}", e.getMessage());
        }
    }

    static class GenderDeserializer extends JsonDeserializer<Gender> {
        @Override
        public Gender deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
            String value = p.getValueAsString();
            if (value == null || value.isEmpty()) {
                return null; // Return null for empty strings
            }
            try {
                return Gender.valueOf(value);
            } catch (IllegalArgumentException e) {
                return null; // Return null for invalid values
            }
        }
    }

}
