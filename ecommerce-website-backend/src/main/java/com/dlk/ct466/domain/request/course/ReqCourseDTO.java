package com.dlk.ct466.domain.request.course;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ReqCourseDTO {
    private String courseUrl;
    private BigDecimal price;
    private BigDecimal discountedPrice;
    private String userId;
}
