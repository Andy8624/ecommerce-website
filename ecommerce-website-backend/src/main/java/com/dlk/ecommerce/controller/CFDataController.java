package com.dlk.ecommerce.controller;

import com.dlk.ecommerce.domain.response.recommendation.CFResponse;
import com.dlk.ecommerce.domain.response.recommendation.InteractionDTO;
import com.dlk.ecommerce.domain.response.recommendation.ReviewDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/v1/recommendation/cf-data")
@Slf4j
public class CFDataController {

    @GetMapping
    public ResponseEntity<CFResponse> getCFData() {
        log.info("Get CF data");

        /// Danh sách các tương tác (interactions)
        List<InteractionDTO> interactions = Arrays.asList(
                // Dữ liệu cũ giữ nguyên...
                new InteractionDTO("U123", 101L, "VIEW", Instant.parse("2023-08-15T10:00:00Z"), Instant.parse("2023-08-15T10:00:00Z")),
                new InteractionDTO("U123", 101L, "ADD_CART", Instant.parse("2023-08-15T10:01:30Z"), Instant.parse("2023-08-15T10:01:30Z")),
                new InteractionDTO("U123", 102L, "VIEW", Instant.parse("2023-08-15T10:05:00Z"), Instant.parse("2023-08-15T10:05:00Z")),
                new InteractionDTO("U123", 102L, "CLICK", Instant.parse("2023-08-15T10:06:00Z"), Instant.parse("2023-08-15T10:06:00Z")),
                new InteractionDTO("U456", 101L, "PURCHASE", Instant.parse("2023-08-16T14:20:00Z"), Instant.parse("2023-08-16T14:20:00Z")),
                new InteractionDTO("U456", 103L, "VIEW", Instant.parse("2023-08-16T14:30:00Z"), Instant.parse("2023-08-16T14:30:00Z")),
                new InteractionDTO("U789", 103L, "VIEW", Instant.parse("2023-08-17T09:30:00Z"), Instant.parse("2023-08-17T09:30:00Z")),
                new InteractionDTO("U789", 104L, "ADD_CART", Instant.parse("2023-08-17T09:35:00Z"), Instant.parse("2023-08-17T09:35:00Z")),
                new InteractionDTO("U101", 105L, "VIEW", Instant.parse("2023-08-18T12:00:00Z"), Instant.parse("2023-08-18T12:00:00Z")),
                new InteractionDTO("U101", 105L, "PURCHASE", Instant.parse("2023-08-18T12:05:00Z"), Instant.parse("2023-08-18T12:05:00Z")),
                new InteractionDTO("U456", 104L, "VIEW", Instant.parse("2023-08-16T15:00:00Z"), Instant.parse("2023-08-16T15:00:00Z")),
                new InteractionDTO("U456", 105L, "ADD_CART", Instant.parse("2023-08-16T15:30:00Z"), Instant.parse("2023-08-16T15:30:00Z")),
                new InteractionDTO("U789", 101L, "PURCHASE", Instant.parse("2023-08-17T10:00:00Z"), Instant.parse("2023-08-17T10:00:00Z")),
                new InteractionDTO("U789", 102L, "VIEW", Instant.parse("2023-08-17T10:15:00Z"), Instant.parse("2023-08-17T10:15:00Z")),
                new InteractionDTO("U789", 104L, "PURCHASE", Instant.parse("2023-08-17T10:30:00Z"), Instant.parse("2023-08-17T10:30:00Z")),

                // Tương tác với type mới
                // Chuỗi tương tác hoàn chỉnh bao gồm REMOVE_CART
                new InteractionDTO("U301", 106L, "VIEW", Instant.parse("2023-08-24T08:00:00Z"), Instant.parse("2023-08-24T08:00:00Z")),
                new InteractionDTO("U301", 106L, "ADD_CART", Instant.parse("2023-08-24T08:05:00Z"), Instant.parse("2023-08-24T08:05:00Z")),
                new InteractionDTO("U301", 106L, "REMOVE_CART", Instant.parse("2023-08-24T08:10:00Z"), Instant.parse("2023-08-24T08:10:00Z")),

                // Chuỗi tương tác với RATING và COMMENT
                new InteractionDTO("U302", 107L, "VIEW", Instant.parse("2023-08-24T09:00:00Z"), Instant.parse("2023-08-24T09:00:00Z")),
                new InteractionDTO("U302", 107L, "PURCHASE", Instant.parse("2023-08-24T09:15:00Z"), Instant.parse("2023-08-24T09:15:00Z")),
                new InteractionDTO("U302", 107L, "RATING", Instant.parse("2023-08-24T10:00:00Z"), Instant.parse("2023-08-24T10:00:00Z")),
                new InteractionDTO("U302", 107L, "COMMENT", Instant.parse("2023-08-24T10:05:00Z"), Instant.parse("2023-08-24T10:05:00Z")),

                // Tương tác SHARE
                new InteractionDTO("U303", 108L, "VIEW", Instant.parse("2023-08-24T11:00:00Z"), Instant.parse("2023-08-24T11:00:00Z")),
                new InteractionDTO("U303", 108L, "SHARE", Instant.parse("2023-08-24T11:10:00Z"), Instant.parse("2023-08-24T11:10:00Z")),

                // Chuỗi tương tác phức tạp
                new InteractionDTO("U304", 109L, "VIEW", Instant.parse("2023-08-24T13:00:00Z"), Instant.parse("2023-08-24T13:00:00Z")),
                new InteractionDTO("U304", 109L, "ADD_CART", Instant.parse("2023-08-24T13:05:00Z"), Instant.parse("2023-08-24T13:05:00Z")),
                new InteractionDTO("U304", 109L, "REMOVE_CART", Instant.parse("2023-08-24T13:10:00Z"), Instant.parse("2023-08-24T13:10:00Z")),
                new InteractionDTO("U304", 109L, "ADD_CART", Instant.parse("2023-08-24T13:15:00Z"), Instant.parse("2023-08-24T13:15:00Z")),
                new InteractionDTO("U304", 109L, "PURCHASE", Instant.parse("2023-08-24T13:20:00Z"), Instant.parse("2023-08-24T13:20:00Z")),
                new InteractionDTO("U304", 109L, "RATING", Instant.parse("2023-08-24T14:00:00Z"), Instant.parse("2023-08-24T14:00:00Z")),
                new InteractionDTO("U304", 109L, "COMMENT", Instant.parse("2023-08-24T14:05:00Z"), Instant.parse("2023-08-24T14:05:00Z")),
                new InteractionDTO("U304", 109L, "SHARE", Instant.parse("2023-08-24T14:10:00Z"), Instant.parse("2023-08-24T14:10:00Z")),

                // Tương tác nhiều sản phẩm
                new InteractionDTO("U305", 110L, "VIEW", Instant.parse("2023-08-24T15:00:00Z"), Instant.parse("2023-08-24T15:00:00Z")),
                new InteractionDTO("U305", 110L, "ADD_CART", Instant.parse("2023-08-24T15:05:00Z"), Instant.parse("2023-08-24T15:05:00Z")),
                new InteractionDTO("U305", 110L, "SHARE", Instant.parse("2023-08-24T15:10:00Z"), Instant.parse("2023-08-24T15:10:00Z")),
                new InteractionDTO("U305", 111L, "VIEW", Instant.parse("2023-08-24T15:15:00Z"), Instant.parse("2023-08-24T15:15:00Z")),
                new InteractionDTO("U305", 111L, "ADD_CART", Instant.parse("2023-08-24T15:20:00Z"), Instant.parse("2023-08-24T15:20:00Z")),
                new InteractionDTO("U305", 111L, "REMOVE_CART", Instant.parse("2023-08-24T15:25:00Z"), Instant.parse("2023-08-24T15:25:00Z"))
        );

        // Danh sách các đánh giá (reviews)
        List<ReviewDTO> reviews = Arrays.asList(
                // Dữ liệu cũ giữ nguyên...
                new ReviewDTO("U456", 101L, 4, "Sản phẩm tốt, chất lượng ổn", Instant.parse("2023-08-16T14:25:00Z"), Instant.parse("2023-08-16T14:25:00Z")),
                new ReviewDTO("U789", 103L, 5, "Rất hài lòng", Instant.parse("2023-08-17T09:30:00Z"), Instant.parse("2023-08-17T09:30:00Z")),
                new ReviewDTO("U101", 105L, 3, "Chất lượng trung bình", Instant.parse("2023-08-18T12:10:00Z"), Instant.parse("2023-08-18T12:10:00Z")),
                new ReviewDTO("U123", 102L, 4, "Cũng được, nhưng có thể tốt hơn", Instant.parse("2023-08-15T10:10:00Z"), Instant.parse("2023-08-15T10:10:00Z")),
                new ReviewDTO("U456", 104L, 5, "Sản phẩm tuyệt vời", Instant.parse("2023-08-16T15:15:00Z"), Instant.parse("2023-08-16T15:15:00Z")),
                new ReviewDTO("U789", 105L, 4, "Chất lượng tốt", Instant.parse("2023-08-17T10:45:00Z"), Instant.parse("2023-08-17T10:45:00Z")),
                new ReviewDTO("U101", 102L, 2, "Không hài lòng với chất lượng", Instant.parse("2023-08-18T12:20:00Z"), Instant.parse("2023-08-18T12:20:00Z")),
                new ReviewDTO("U123", 103L, 5, "Rất hài lòng", Instant.parse("2023-08-15T10:20:00Z"), Instant.parse("2023-08-15T10:20:00Z")),

                // Đánh giá mới phù hợp với các tương tác RATING và COMMENT
                new ReviewDTO("U302", 107L, 5, "Sản phẩm xuất sắc, đáng đồng tiền", Instant.parse("2023-08-24T10:05:00Z"), Instant.parse("2023-08-24T10:05:00Z")),
                new ReviewDTO("U304", 109L, 4, "Chất lượng tốt, giao hàng nhanh, đóng gói cẩn thận", Instant.parse("2023-08-24T14:05:00Z"), Instant.parse("2023-08-24T14:05:00Z")),

                // Thêm các đánh giá mới
                new ReviewDTO("U306", 106L, 4, "Sản phẩm đẹp, chất lượng tốt", Instant.parse("2023-08-24T16:00:00Z"), Instant.parse("2023-08-24T16:00:00Z")),
                new ReviewDTO("U307", 107L, 5, "Tuyệt vời, sẽ ủng hộ shop dài dài", Instant.parse("2023-08-24T16:30:00Z"), Instant.parse("2023-08-24T16:30:00Z")),
                new ReviewDTO("U308", 108L, 3, "Sản phẩm tạm ổn, cần cải thiện thêm", Instant.parse("2023-08-24T17:00:00Z"), Instant.parse("2023-08-24T17:00:00Z")),
                new ReviewDTO("U309", 109L, 5, "Chất lượng vượt mong đợi", Instant.parse("2023-08-24T17:30:00Z"), Instant.parse("2023-08-24T17:30:00Z")),
                new ReviewDTO("U310", 110L, 4, "Hài lòng với sản phẩm", Instant.parse("2023-08-24T18:00:00Z"), Instant.parse("2023-08-24T18:00:00Z")),
                new ReviewDTO("U311", 111L, 2, "Sản phẩm không như mong đợi", Instant.parse("2023-08-24T18:30:00Z"), Instant.parse("2023-08-24T18:30:00Z")),
                new ReviewDTO("U312", 106L, 5, "Tuyệt vời về mọi mặt", Instant.parse("2023-08-24T19:00:00Z"), Instant.parse("2023-08-24T19:00:00Z")),
                new ReviewDTO("U313", 107L, 4, "Đáng giá để mua và sử dụng", Instant.parse("2023-08-24T19:30:00Z"), Instant.parse("2023-08-24T19:30:00Z"))
        );

        CFResponse response = new CFResponse(interactions, reviews);
        return ResponseEntity.ok(response);
    }
}
