package com.dlk.ecommerce.controller;

import com.dlk.ecommerce.domain.response.recommendation.CFResponse;
import com.dlk.ecommerce.domain.response.recommendation.InteractionDTO;
import com.dlk.ecommerce.domain.response.recommendation.ReviewDTO;
import com.dlk.ecommerce.service.ProductReviewService;
import com.dlk.ecommerce.service.UserProductInteractionService;
import com.dlk.ecommerce.util.constant.InteractionType;
import com.dlk.ecommerce.util.error.IdInvalidException;
import com.dlk.ecommerce.util.helper.LogFormatter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recommendation/cf-data")
@RequiredArgsConstructor
@Slf4j
public class CFDataController {
    private final UserProductInteractionService userProductInteractionService;
    private final ProductReviewService productReviewService;

    /**
     * Endpoint để lấy dữ liệu cho collaborative filtering
     */
    @GetMapping
    public ResponseEntity<CFResponse> getCFData() {
//        log.info("Getting CF data for recommendation system");

        // Lấy tất cả tương tác người dùng
        List<InteractionDTO> interactions = userProductInteractionService.getAllInteractions();

        // Lấy tất cả đánh giá sản phẩm
        List<ReviewDTO> reviews = productReviewService.getAllReviewsAsDTO();

        CFResponse response = new CFResponse(interactions, reviews);
//        LogFormatter.logFormattedRequest("Response CF data", response);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint để lưu tương tác người dùng mới
     */
    @PostMapping("/interaction")
    public ResponseEntity<InteractionDTO> saveInteraction(
            @RequestParam String userId,
            @RequestParam Long toolId,
            @RequestParam String interactionType) {
//        log.info("Saving new interaction for user: {}, product: {}, type: {}", userId, toolId, interactionType);

        try {
            InteractionType type = InteractionType.valueOf(interactionType);
            var interaction = userProductInteractionService.saveInteraction(userId, toolId, type);

            // Chuyển đổi kết quả thành DTO để trả về
            InteractionDTO dto = new InteractionDTO(
                    interaction.getUser().getUserId(),
                    interaction.getTool().getToolId(),
                    interaction.getInteractionType().name(),
                    interaction.getCreatedAt(),
                    interaction.getUpdatedAt());

            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            log.error("Invalid interaction type: {}", interactionType, e);
            return ResponseEntity.badRequest().build();
        } catch (IdInvalidException e) {
            log.error("Invalid user or tool ID", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy tương tác của người dùng cụ thể
     */
    @GetMapping("/interactions/user/{userId}")
    public ResponseEntity<List<InteractionDTO>> getUserInteractions(@PathVariable String userId) {
        log.info("Getting interactions for user: {}", userId);
        List<InteractionDTO> interactions = userProductInteractionService.getInteractionsByUserId(userId);
        return ResponseEntity.ok(interactions);
    }

    /**
     * Lấy tương tác cho sản phẩm cụ thể
     */
    @GetMapping("/interactions/product/{toolId}")
    public ResponseEntity<List<InteractionDTO>> getProductInteractions(@PathVariable Long toolId) {
        log.info("Getting interactions for product: {}", toolId);
        List<InteractionDTO> interactions = userProductInteractionService.getInteractionsByToolId(toolId);
        return ResponseEntity.ok(interactions);
    }

    /**
     * Lấy đánh giá của người dùng cụ thể
     */
    @GetMapping("/reviews/user/{userId}")
    public ResponseEntity<List<ReviewDTO>> getUserReviews(@PathVariable String userId) {
        log.info("Getting reviews for user: {}", userId);
        List<ReviewDTO> reviews = productReviewService.getReviewsByUserId(userId);
        return ResponseEntity.ok(reviews);
    }

    /**
     * Lấy đánh giá cho sản phẩm cụ thể
     */
    @GetMapping("/reviews/product/{toolId}")
    public ResponseEntity<List<ReviewDTO>> getProductReviews(@PathVariable Long toolId) {
        log.info("Getting reviews for product: {}", toolId);
        List<ReviewDTO> reviews = productReviewService.getReviewsAsDTOByToolId(toolId);
        return ResponseEntity.ok(reviews);
    }
}
