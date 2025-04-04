package com.dlk.ecommerce.util.constant;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Gender {
    MALE, FEMALE, OTHER;

    @JsonCreator
    public static Gender fromString(String value) {
        if (value == null || value.isEmpty()) {
            return null;
        }

        try {
            return Gender.valueOf(value);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    }
