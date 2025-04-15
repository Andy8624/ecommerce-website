package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.ProductReview;
import com.dlk.ecommerce.domain.entity.Tool;
import com.dlk.ecommerce.domain.entity.User;
import com.dlk.ecommerce.domain.request.product_review.ProductReviewRequest;
import com.dlk.ecommerce.repository.ProductReviewRepository;
import com.dlk.ecommerce.util.error.IdInvalidException;
import com.dlk.ecommerce.util.helper.LogFormatter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductReviewService {
    private final ProductReviewRepository productPreviewRepository;
    private final UserService userService;
    private final ToolService toolService;
    private final OrderService orderService;

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
                .category_name_1(request.getCategory_name_1())
                .category_detail_name_1(request.getCategory_detail_name_1())
                .category_name_2(request.getCategory_name_2())
                .category_detail_name_2(request.getCategory_detail_name_2())
                .quantity(request.getQuantity())
                .build();
        productPreviewRepository.save(productReview);
        orderService.checkRated(request.getOrderId());
        return null;

    }

    public List<ProductReview> fetchProductReviewByBuyerAndTool(String buyerId, Long toolId) {
        return productPreviewRepository.findByTool_ToolIdAndUser_UserId(toolId, buyerId);
    }

    public List<ProductReview> getAllByProductId(Long toolId) {
        return productPreviewRepository.findByTool_ToolId(toolId);
    }
}
