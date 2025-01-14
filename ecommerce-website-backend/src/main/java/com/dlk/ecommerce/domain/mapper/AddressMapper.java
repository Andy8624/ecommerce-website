package com.dlk.ecommerce.domain.mapper;

import com.dlk.ecommerce.domain.entity.Address;
import com.dlk.ecommerce.domain.response.address.ResAddressDTO;
import com.dlk.ecommerce.domain.response.address.ResCreateAddressDTO;
import com.dlk.ecommerce.domain.response.address.ResUpdateAddressDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface AddressMapper {
    @Mapping(source = "user", target = "user")
    ResCreateAddressDTO mapToCreateAddressDTO(Address address);

    @Mapping(source = "user", target = "user")
    ResUpdateAddressDTO mapToUpdateAddressDTO(Address address);

    ResAddressDTO mapToAddressDTO(Address address);
}
