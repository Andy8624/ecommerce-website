package com.dlk.ecommerce.domain.mapper;

import com.dlk.ecommerce.domain.entity.OrderTool;
import com.dlk.ecommerce.domain.response.orderTool.ResCreateOrderToolDTO;
import com.dlk.ecommerce.domain.response.orderTool.ResOrderToolDTO;
import com.dlk.ecommerce.domain.response.orderTool.ResUpdateOrderToolDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
public interface OrderToolMapper {
    ResCreateOrderToolDTO mapToCreateOrderToolDTO(OrderTool orderTool);

    ResUpdateOrderToolDTO mapToUpdateOrderToolDTO(OrderTool orderTool) ;

    ResOrderToolDTO mapToOrderToolDTO(OrderTool orderTool);
}
