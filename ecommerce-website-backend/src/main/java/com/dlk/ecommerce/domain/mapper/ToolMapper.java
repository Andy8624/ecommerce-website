package com.dlk.ecommerce.domain.mapper;

import com.dlk.ecommerce.domain.entity.Tool;
import com.dlk.ecommerce.domain.response.tool.ResCreateToolDTO;
import com.dlk.ecommerce.domain.response.tool.ResToolDTO;
import com.dlk.ecommerce.domain.response.tool.ResUpdateToolDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses={UserMapper.class, ToolTypeMapper.class})
public interface ToolMapper {

    @Mapping(target = "toolType", source = "toolType")
    @Mapping(target = "user", source = "user")
    ResToolDTO mapToResToolDTO(Tool tool);

    @Mapping(target = "toolType", source = "toolType")
    @Mapping(target = "user", source = "user")
    ResCreateToolDTO mapToResCreateToolDTO(Tool tool);

    @Mapping(target = "toolType", source = "toolType")
    @Mapping(target = "user", source = "user")
    ResUpdateToolDTO mapToResUpdateToolDTO(Tool tool);
}
