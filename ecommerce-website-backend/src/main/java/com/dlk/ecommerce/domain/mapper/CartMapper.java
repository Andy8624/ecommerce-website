package com.dlk.ecommerce.domain.mapper;

import com.dlk.ecommerce.domain.entity.Cart;
import com.dlk.ecommerce.domain.response.cart.ResCartDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CartMapper {
    ResCartDTO toCartDTO(Cart cart);

    Cart toCart(ResCartDTO resCartDTO);
}


