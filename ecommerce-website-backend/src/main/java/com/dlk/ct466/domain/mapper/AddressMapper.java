package com.dlk.ct466.domain.mapper;

import com.dlk.ct466.domain.entity.Address;
import com.dlk.ct466.domain.entity.User;
import com.dlk.ct466.domain.response.address.ResAddressDTO;
import com.dlk.ct466.domain.response.address.ResCreateAddressDTO;
import com.dlk.ct466.domain.response.address.ResUpdateAddressDTO;
import org.springframework.stereotype.Component;

@Component
public class AddressMapper {
    public static ResCreateAddressDTO mapToCreateAddressDTO(Address address) {
        User user = address.getUser();
        ResCreateAddressDTO.AddressUser addressUser = new ResCreateAddressDTO.AddressUser();
        addressUser.setUserId(user.getUserId());
        addressUser.setEmail(user.getEmail());
        addressUser.setFullName(user.getFullName());

        return ResCreateAddressDTO.builder()
                .addressId(address.getAddressId())
                .street(address.getStreet())
                .ward(address.getWard())
                .district(address.getDistrict())
                .city(address.getCity())
                .createdAt(address.getCreatedAt())
                .createdBy(address.getCreatedBy())
                .user(addressUser)
                .build();
    }

    public static ResUpdateAddressDTO mapToUpdateAddressDTO(Address address) {
        User user = address.getUser();
        ResUpdateAddressDTO.AddressUser addressUser = new ResUpdateAddressDTO.AddressUser();
        addressUser.setUserId(user.getUserId());
        addressUser.setEmail(user.getEmail());
        addressUser.setFullName(user.getFullName());

        return ResUpdateAddressDTO.builder()
                .addressId(address.getAddressId())
                .street(address.getStreet())
                .ward(address.getWard())
                .district(address.getDistrict())
                .city(address.getCity())
                .createdAt(address.getCreatedAt())
                .createdBy(address.getCreatedBy())
                .updatedAt(address.getUpdatedAt())
                .updatedBy(address.getUpdatedBy())
                .user(addressUser)
                .build();
    }

    public static ResAddressDTO mapToAddressDTO(Address address) {
        return ResAddressDTO.builder()
                .addressId(address.getAddressId())
                .street(address.getStreet())
                .ward(address.getWard())
                .district(address.getDistrict())
                .city(address.getCity())
                .createdAt(address.getCreatedAt())
                .createdBy(address.getCreatedBy())
                .updatedAt(address.getUpdatedAt())
                .updatedBy(address.getUpdatedBy())
                .build();
    }
}
