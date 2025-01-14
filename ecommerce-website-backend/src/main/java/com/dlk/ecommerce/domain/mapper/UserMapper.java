package com.dlk.ecommerce.domain.mapper;

import com.dlk.ecommerce.domain.entity.User;
import com.dlk.ecommerce.domain.request.user.ReqCreateUser;
import com.dlk.ecommerce.domain.response.user.ResCreateUserDTO;
import com.dlk.ecommerce.domain.response.user.ResUpdateUserDTO;
import com.dlk.ecommerce.domain.response.user.ResUserDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(ReqCreateUser reqCreateUser);

    ReqCreateUser toReqCreateUser(User user);

    ResUpdateUserDTO mapToUpdateUserDTO(User user);

    @Mapping(source = "role.roleId", target = "role.roleId")
    @Mapping(source = "role.name", target = "role.name")
    ResUserDTO mapToUserDTO(User user);

    @Mapping(source = "role", target = "role")
    ResCreateUserDTO mapToCreateUserDTO(User user);
}
