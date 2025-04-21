package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.ProductReview;
import com.dlk.ecommerce.domain.entity.Tool;
import com.dlk.ecommerce.domain.entity.User;
import com.dlk.ecommerce.domain.request.product_review.ProductReviewRequest;
import com.dlk.ecommerce.domain.response.recommendation.ReviewDTO;
import com.dlk.ecommerce.repository.ProductReviewRepository;
import com.dlk.ecommerce.util.error.IdInvalidException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
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

    /**
     * Lấy tất cả đánh giá sản phẩm và chuyển đổi thành ReviewDTO
     * 
     * @return Danh sách các đánh giá dưới dạng ReviewDTO
     */
    public List<ReviewDTO> getAllReviewsAsDTO() {
//        log.info("Fetching all product reviews for recommendation system");
        List<ProductReview> productReviews = productPreviewRepository.findAll();
        return convertToReviewDTOs(productReviews);
    }

    /**
     * Lấy đánh giá của một người dùng cụ thể
     * 
     * @param userId ID của người dùng
     * @return Danh sách các đánh giá của người dùng
     */
    public List<ReviewDTO> getReviewsByUserId(String userId) {
//        log.info("Fetching reviews for user ID: {}", userId);
        List<ProductReview> productReviews = productPreviewRepository.findByUser_UserId(userId);
        return convertToReviewDTOs(productReviews);
    }

    /**
     * Lấy đánh giá cho một sản phẩm cụ thể
     * 
     * @param toolId ID của sản phẩm
     * @return Danh sách các đánh giá về sản phẩm
     */
    public List<ReviewDTO> getReviewsAsDTOByToolId(Long toolId) {
        log.info("Fetching reviews for tool ID: {}", toolId);
        List<ProductReview> productReviews = productPreviewRepository.findByTool_ToolId(toolId);
        return convertToReviewDTOs(productReviews);
    }

    /**
     * Chuyển đổi danh sách entity ProductReview thành ReviewDTO
     * 
     * @param productReviews Danh sách ProductReview
     * @return Danh sách ReviewDTO
     */
    private List<ReviewDTO> convertToReviewDTOs(List<ProductReview> productReviews) {
        return productReviews.stream()
                .map(review -> new ReviewDTO(
                        review.getUser().getUserId(),
                        review.getTool().getToolId(),
                        review.getRating(),
                        review.getBuyerReview(),
                        review.getCreatedAt(),
                        review.getUpdatedAt()))
                .collect(Collectors.toList());
    }
}
