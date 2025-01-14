package com.dlk.ecommerce.domain.mapper;

import com.dlk.ecommerce.domain.entity.OrderTool;
import com.dlk.ecommerce.domain.response.orderTool.ResCreateOrderToolDTO;
import com.dlk.ecommerce.domain.response.orderTool.ResOrderToolDTO;
import com.dlk.ecommerce.domain.response.orderTool.ResUpdateOrderToolDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring", uses= {OrderMapper.class, ToolMapper.class})
public interface OrderToolMapper {

    @Mapping(source = "order", target = "order")
    @Mapping(source = "tool", target = "tool")
    ResCreateOrderToolDTO mapToCreateOrderToolDTO(OrderTool orderTool);

    @Mapping(source = "order", target = "order")
    @Mapping(source = "tool", target = "tool")
    ResUpdateOrderToolDTO mapToUpdateOrderToolDTO(OrderTool orderTool) ;

    @Mapping(source = "order", target = "order")
    @Mapping(source = "tool", target = "tool")
    ResOrderToolDTO mapToOrderToolDTO(OrderTool orderTool);
}
