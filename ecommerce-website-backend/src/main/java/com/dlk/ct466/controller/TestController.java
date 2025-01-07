package com.dlk.ct466.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/test")
public class TestController {
    @GetMapping
    public String helloString() {
        return "hello";
    }

    @PostMapping
    public ResponseEntity<String> helloRest() {
        return ResponseEntity.ok("hello rest");
    }
}
