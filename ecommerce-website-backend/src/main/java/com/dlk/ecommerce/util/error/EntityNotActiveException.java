package com.dlk.ecommerce.util.error;

public class EntityNotActiveException extends RuntimeException {
    public EntityNotActiveException(String message) {
        super(message);
    }
}