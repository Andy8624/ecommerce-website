package com.dlk.ecommerce.domain.mapper;

import com.dlk.ecommerce.domain.entity.Address;
import com.dlk.ecommerce.domain.response.address.ResAddressDTO;
import com.dlk.ecommerce.domain.response.address.ResCreateAddressDTO;
import com.dlk.ecommerce.domain.response.address.ResUpdateAddressDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    ResCreateAddressDTO mapToCreateAddressDTO(Address address);

    ResUpdateAddressDTO mapToUpdateAddressDTO(Address address);

    ResAddressDTO mapToAddressDTO(Address address);
}
