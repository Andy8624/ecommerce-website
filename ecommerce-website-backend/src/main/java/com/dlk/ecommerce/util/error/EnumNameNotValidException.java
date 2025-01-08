package com.dlk.ecommerce.util.error;

public class EnumNameNotValidException extends RuntimeException {
    public EnumNameNotValidException(String message) {
        super(message);
    }
}