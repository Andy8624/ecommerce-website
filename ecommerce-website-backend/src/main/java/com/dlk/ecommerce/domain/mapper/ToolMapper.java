package com.dlk.ecommerce.domain.mapper;

import com.dlk.ecommerce.domain.entity.Tool;
import com.dlk.ecommerce.domain.response.tool.ResCreateToolDTO;
import com.dlk.ecommerce.domain.response.tool.ResToolDTO;
import com.dlk.ecommerce.domain.response.tool.ResUpdateToolDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ToolMapper {
    ResToolDTO mapToResToolDTO(Tool tool);

    ResCreateToolDTO mapToResCreateToolDTO(Tool tool);

    ResUpdateToolDTO mapToResUpdateToolDTO(Tool tool);
}
