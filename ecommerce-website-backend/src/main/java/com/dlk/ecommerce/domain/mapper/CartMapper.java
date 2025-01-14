package com.dlk.ecommerce.domain.mapper;

import com.dlk.ecommerce.domain.entity.Cart;
import com.dlk.ecommerce.domain.response.cart.ResCartDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface CartMapper {
    @Mapping(source = "user", target = "user")
    ResCartDTO toCartDTO(Cart cart);

    @Mapping(source = "user", target = "user")
    Cart toCart(ResCartDTO resCartDTO);
}


