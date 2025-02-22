package com.dlk.ecommerce.controller;

import com.dlk.ecommerce.domain.response.recommendation.CBFResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recommendation/cbf-data")
@Slf4j
public class CBFDataController {
    @GetMapping
    public ResponseEntity<List<CBFResponse>> getCBFData() {
        List<CBFResponse> response = List.of(
                new CBFResponse(101L, "Electric Drill", "High-power electric drill for professionals", "Power Tools", "Bosch", "99.99"),
                new CBFResponse(102L, "Cordless Screwdriver", "Compact cordless screwdriver for DIY projects", "Power Tools", "Makita", "59.99"),
                new CBFResponse(103L, "Circular Saw", "Heavy-duty circular saw with precision cutting", "Power Tools", "DeWalt", "149.99"),
                new CBFResponse(104L, "Hammer", "Standard hammer for all general purposes", "Hand Tools", "Stanley", "12.49"),
                new CBFResponse(105L, "Wrench Set", "Complete set of adjustable wrenches", "Hand Tools", "Craftsman", "39.99"),
                new CBFResponse(106L, "Electric Sander", "Compact electric sander for smooth finishes", "Power Tools", "Bosch", "89.99"),
                new CBFResponse(107L, "Laser Measure", "Laser measurement tool with accuracy up to 100 feet", "Measuring Tools", "Bosch", "49.99"),
                new CBFResponse(108L, "Impact Driver", "Heavy-duty impact driver for high torque tasks", "Power Tools", "Makita", "129.99"),
                new CBFResponse(109L, "Plumbing Pipe Wrench", "Plumbing wrench for easy pipe fitting", "Hand Tools", "Craftsman", "25.99"),
                new CBFResponse(110L, "Angle Grinder", "Compact angle grinder with high RPM", "Power Tools", "DeWalt", "89.00"),
                new CBFResponse(111L, "Tape Measure", "Durable tape measure with a metal casing", "Measuring Tools", "Stanley", "14.99"),
                new CBFResponse(112L, "Paint Sprayer", "Electric paint sprayer for home use", "Painting Tools", "DeWalt", "99.00"),
                new CBFResponse(113L, "Drill Bit Set", "High-quality drill bit set for various materials", "Accessories", "Bosch", "24.99"),
                new CBFResponse(114L, "Heat Gun", "Adjustable heat gun for stripping paint and shrink wrapping", "Power Tools", "Makita", "59.99"),
                new CBFResponse(115L, "Socket Set", "Professional socket set for automotive repairs", "Hand Tools", "Craftsman", "79.99"),
                new CBFResponse(116L, "Toolbox", "Heavy-duty toolbox for organizing tools", "Storage", "Stanley", "29.99"),
                new CBFResponse(117L, "Flashlight", "LED flashlight with adjustable brightness", "Electrical Tools", "Bosch", "19.99"),
                new CBFResponse(118L, "Safety Glasses", "Protective safety glasses for working with power tools", "Safety Gear", "DeWalt", "9.99"),
                new CBFResponse(119L, "Work Gloves", "Durable gloves for hand protection during work", "Safety Gear", "Makita", "14.50"),
                new CBFResponse(120L, "Electric Heater", "Compact electric heater for workshop use", "Electrical Tools", "Bosch", "129.00")
        );

        return ResponseEntity.ok(response);
    }
}
