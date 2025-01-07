package com.dlk.ct466.util.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// được truy cập tại thời điểm chạy chương tnirhf
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD) // được sử dụng trên các method
public @interface ApiMessage {
    String value();
}