package com.dlk.ct466.domain.mapper;

import com.dlk.ct466.domain.entity.Cart;
import com.dlk.ct466.domain.entity.User;
import com.dlk.ct466.domain.response.cart.ResCartDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CartMapper {

    CartMapper INSTANCE = Mappers.getMapper(CartMapper.class);

    @Mapping(source = "user.userId", target = "user.userId")
    @Mapping(source = "user.fullName", target = "user.fullName")
    @Mapping(source = "user.email", target = "user.email")
    ResCartDTO toCartDTO(Cart cart);

    @Mapping(source = "user.userId", target = "user.userId")
    @Mapping(source = "user.fullName", target = "user.fullName")
    @Mapping(source = "user.email", target = "user.email")
    Cart toCart(ResCartDTO resCartDTO);
}


