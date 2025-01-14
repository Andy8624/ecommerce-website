package com.dlk.ecommerce.domain.mapper;

import com.dlk.ecommerce.domain.entity.ToolType;
import com.dlk.ecommerce.domain.response.toolType.ToolTypeDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ToolTypeMapper {
    ToolTypeDTO toToolTypeDTO(ToolType toolType);
    ToolType toToolType(ToolTypeDTO toolTypeDTO);
}
