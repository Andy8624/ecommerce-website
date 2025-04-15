package com.dlk.ecommerce.domain.request.product_review;

import lombok.Data;

@Data
public class ProductReviewRequest {
    String buyerId;
    Long toolId;
    Integer rating;
    String buyerReview;
    String imageUrls;
    String category_name_1;
    String category_detail_name_1;
    String category_name_2;
    String category_detail_name_2;
    String orderId;
    int quantity;
}
