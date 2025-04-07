package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.ProductReview;
import com.dlk.ecommerce.domain.entity.Tool;
import com.dlk.ecommerce.domain.entity.User;
import com.dlk.ecommerce.domain.request.product_review.ProductReviewRequest;
import com.dlk.ecommerce.repository.ProductReviewRepository;
import com.dlk.ecommerce.util.error.IdInvalidException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductReviewService {
    private final ProductReviewRepository productPreviewRepository;
    private final UserService userService;
    private final ToolService toolService;

    public Void createProductReview(ProductReviewRequest request) throws IdInvalidException {
        Tool tool = toolService.getToolById(request.getToolId());
        User buyer = userService.fetchUserById(request.getBuyerId());
        ProductReview productReview = new ProductReview().toBuilder()
                .user(buyer)
                .tool(tool)
                .buyerReview(request.getBuyerReview())
                .shopAnswer(null)
                .imageUrls(request.getImageUrls())
                .rating(request.getRating())
                .build();
        productPreviewRepository.save(productReview);
        return null;

    }

    public ProductReview getByBuyerIdAndToolId(String buyerId, Long toolId) {
        return productPreviewRepository.findByTool_ToolIdAndUser_UserId(toolId, buyerId);
    }

    public List<ProductReview> getAllByProductId(Long toolId) {
        return productPreviewRepository.findByTool_ToolId(toolId);
    }
}
