package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.Tool;
import com.dlk.ecommerce.domain.entity.User;
import com.dlk.ecommerce.domain.entity.UserProductInteraction;
import com.dlk.ecommerce.domain.response.recommendation.InteractionDTO;
import com.dlk.ecommerce.repository.UserProductInteractionRepository;
import com.dlk.ecommerce.util.constant.InteractionType;
import com.dlk.ecommerce.util.error.IdInvalidException;
import com.dlk.ecommerce.util.helper.LogFormatter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserProductInteractionService {

    private final UserProductInteractionRepository interactionRepository;
    private final UserService userService;
    private final ToolService toolService;

    public UserProductInteraction saveInteraction(String userId, Long toolId, InteractionType interactionType)
            throws IdInvalidException {
        User user = userService.fetchUserById(userId);
        Tool tool = toolService.getToolById(toolId);

        // Luôn tạo mới một bản ghi tương tác để theo dõi tần suất
        UserProductInteraction interaction = UserProductInteraction.builder()
                .user(user)
                .tool(tool)
                .interactionType(interactionType)
                .build();
//        LogFormatter.logFormattedRequest("Save interaction", interaction);
        return interactionRepository.save(interaction);
    }

    public List<InteractionDTO> getAllInteractions() {
//        log.info("Fetching all user product interactions");
        List<UserProductInteraction> interactions = interactionRepository.findAll();
        return convertToInteractionDTOs(interactions);
    }

    public List<InteractionDTO> getInteractionsByUserId(String userId) {
        log.info("Fetching interactions for user ID: {}", userId);
        List<UserProductInteraction> interactions = interactionRepository.findByUser_UserId(userId);
        return convertToInteractionDTOs(interactions);
    }

    public List<InteractionDTO> getInteractionsByToolId(Long toolId) {
        log.info("Fetching interactions for tool ID: {}", toolId);
        List<UserProductInteraction> interactions = interactionRepository.findByTool_ToolId(toolId);
        return convertToInteractionDTOs(interactions);
    }

    /**
     * Chuyển đổi danh sách entity thành DTO
     */
    private List<InteractionDTO> convertToInteractionDTOs(List<UserProductInteraction> interactions) {
        return interactions.stream()
                .map(interaction -> new InteractionDTO(
                        interaction.getUser().getUserId(),
                        interaction.getTool().getToolId(),
                        interaction.getInteractionType().name(),
                        interaction.getCreatedAt(),
                        interaction.getUpdatedAt()))
                .collect(Collectors.toList());
    }
}