package com.dlk.ecommerce.domain.request.product_review;

import lombok.Data;

@Data
public class ProductReviewRequest {
    String buyerId;
    Long toolId;
    Integer rating;
    String buyerReview;
    String imageUrls;
}
