package com.dlk.ct466.domain.mapper;

import com.dlk.ct466.domain.entity.Tool;
import com.dlk.ct466.domain.response.tool.ResCreateToolDTO;
import com.dlk.ct466.domain.response.tool.ResToolDTO;
import com.dlk.ct466.domain.response.tool.ResUpdateToolDTO;
import org.springframework.stereotype.Component;

@Component
public class ToolMapper {
    public static ResToolDTO mapToResToolDTO(Tool tool) {
        ResToolDTO.ToolOwner owner = new ResToolDTO.ToolOwner();
        owner.setUserId(tool.getUser().getUserId());
        owner.setEmail(tool.getUser().getEmail());
        owner.setFullName(tool.getUser().getFullName());

        ResToolDTO.TypeOfTool type = new ResToolDTO.TypeOfTool();
        type.setToolTypeId(tool.getToolType().getToolTypeId());
        type.setName(tool.getToolType().getName());

        return ResToolDTO.builder()
                .toolId(tool.getToolId())
                .name(tool.getName())
                .description(tool.getDescription())
                .discountedPrice(tool.getDiscountedPrice())
                .stockQuantity(tool.getStockQuantity())
                .imageUrl(tool.getImageUrl())
                .price(tool.getPrice())
                .isActive(tool.isActive())
                .user(owner)
                .toolType(type)
                .createdAt(tool.getCreatedAt())
                .createdBy(tool.getCreatedBy())
                .updatedBy(tool.getUpdatedBy())
                .updatedAt(tool.getUpdatedAt())
                .build();
    }

    public static ResCreateToolDTO mapToResCreateToolDTO(Tool tool) {
        ResCreateToolDTO.ToolOwner owner = new ResCreateToolDTO.ToolOwner();
        owner.setUserId(tool.getUser().getUserId());
        owner.setEmail(tool.getUser().getEmail());
        owner.setFullName(tool.getUser().getFullName());

        ResCreateToolDTO.TypeOfTool type = new ResCreateToolDTO.TypeOfTool();
        type.setToolTypeId(tool.getToolType().getToolTypeId());
        type.setName(tool.getToolType().getName());

        return ResCreateToolDTO.builder()
                .toolId(tool.getToolId())
                .name(tool.getName())
                .description(tool.getDescription())
                .discountedPrice(tool.getDiscountedPrice())
                .stockQuantity(tool.getStockQuantity())
                .imageUrl(tool.getImageUrl())
                .price(tool.getPrice())
                .isActive(tool.isActive())
                .user(owner)
                .toolType(type)
                .createdAt(tool.getCreatedAt())
                .createdBy(tool.getCreatedBy())
                .build();
    }

    public static ResUpdateToolDTO mapToResUpdateToolDTO(Tool tool) {
        ResUpdateToolDTO.ToolOwner owner = new ResUpdateToolDTO.ToolOwner();
        owner.setUserId(tool.getUser().getUserId());
        owner.setEmail(tool.getUser().getEmail());
        owner.setFullName(tool.getUser().getFullName());

        ResUpdateToolDTO.TypeOfTool type = new ResUpdateToolDTO.TypeOfTool();
        type.setToolTypeId(tool.getToolType().getToolTypeId());
        type.setName(tool.getToolType().getName());

        return ResUpdateToolDTO.builder()
                .toolId(tool.getToolId())
                .name(tool.getName())
                .description(tool.getDescription())
                .discountedPrice(tool.getDiscountedPrice())
                .stockQuantity(tool.getStockQuantity())
                .imageUrl(tool.getImageUrl())
                .price(tool.getPrice())
                .isActive(tool.isActive())
                .user(owner)
                .toolType(type)
                .build();
    }
}
