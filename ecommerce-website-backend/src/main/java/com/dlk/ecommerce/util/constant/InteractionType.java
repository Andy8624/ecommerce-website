package com.dlk.ecommerce.util.constant;

public enum InteractionType {
    VIEW,       // Người dùng chỉ xem sản phẩm
    ADD_CART,   // Người dùng thêm sản phẩm vào giỏ hàng (tín hiệu tích cực)
    //REMOVE_CART,// Người dùng loại bỏ sản phẩm khỏi giỏ hàng (tín hiệu tiêu cực)
    PURCHASE,   // Người dùng mua sản phẩm
//    RATING,     // Người dùng đánh giá sản phẩm
    //COMMENT,    // Người dùng đánh giá về sản phẩm (có thể đánh giá cảm xúc bằng LLM sau này)
    //SHARE       // Người dùng chia sẻ sản phẩm
}
