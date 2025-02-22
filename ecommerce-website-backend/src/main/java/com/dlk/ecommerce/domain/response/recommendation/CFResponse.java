package com.dlk.ecommerce.domain.response.recommendation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CFResponse {
    // Danh sách các tương tác của người dùng với sản phẩm
    private List<InteractionDTO> interactions;
    // Danh sách các đánh giá sản phẩm
    private List<ReviewDTO> reviews;
}
