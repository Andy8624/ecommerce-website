package com.dlk.ecommerce.domain.mapper;

import com.dlk.ecommerce.domain.entity.Address;
import com.dlk.ecommerce.domain.entity.Tool;
import com.dlk.ecommerce.domain.entity.ToolType;
import com.dlk.ecommerce.domain.entity.User;
import com.dlk.ecommerce.domain.response.tool.ResCreateToolDTO;
import com.dlk.ecommerce.domain.response.tool.ResToolDTO;
import com.dlk.ecommerce.domain.response.tool.ResUpdateToolDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ToolMapper {
    @Mapping(source = "active", target = "isActive")
    ResToolDTO mapToResToolDTO(Tool tool);

    ResCreateToolDTO mapToResCreateToolDTO(Tool tool);

    ResUpdateToolDTO mapToResUpdateToolDTO(Tool tool);

    @Mapping(source = "userId", target = "userId")
    @Mapping(source = "email", target = "email")
    @Mapping(source = "fullName", target = "fullName")
    @Mapping(source = "address", target = "address")
    ResToolDTO.ToolOwner mapToolOwner(User user);

    @Mapping(source = "toolTypeId", target = "toolTypeId")
    @Mapping(source = "name", target = "name")
    ResToolDTO.TypeOfTool mapTypeOfTool(ToolType toolType);

    @Mapping(source = "city", target = "city")
    @Mapping(source = "district", target = "district")
    @Mapping(source = "ward", target = "ward")
    @Mapping(source = "street", target = "street")
    ResToolDTO.ToolOwner.Address mapAddress (Address address);
}