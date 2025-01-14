package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.Address;
import com.dlk.ecommerce.domain.entity.User;
import com.dlk.ecommerce.domain.mapper.AddressMapper;
import com.dlk.ecommerce.domain.response.ResPaginationDTO;
import com.dlk.ecommerce.domain.response.address.ResCreateAddressDTO;
import com.dlk.ecommerce.domain.response.address.ResUpdateAddressDTO;
import com.dlk.ecommerce.repository.AddressRepository;
import com.dlk.ecommerce.util.PaginationUtil;
import com.dlk.ecommerce.util.error.IdInvalidException;
import com.turkraft.springfilter.converter.FilterSpecification;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;
import com.turkraft.springfilter.parser.FilterParser;
import com.turkraft.springfilter.parser.node.FilterNode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AddressService {
    private final AddressRepository addressRepository;
    private final FilterParser filterParser;
    private final FilterSpecificationConverter filterSpecificationConverter;
    private final UserService userService;
    private final AddressMapper addressMapper;


    public Address getAddressByIdAdmin(String id) throws IdInvalidException {
        return addressRepository.findByAddressId(id).orElseThrow(
                () -> new IdInvalidException("Address with id: '" + id + "' not found")
        );
    }

    public Address getAddressById(String id) throws IdInvalidException {
        return addressRepository.findByAddressIdNotDeleted(id).orElseThrow(
                () -> new IdInvalidException("Address with id: '" + id + "' not found")
        );
    }

    public ResUpdateAddressDTO getAddressByIdDTO(String id) throws IdInvalidException {
        Address address = addressRepository.findByAddressIdNotDeleted(id).orElseThrow(
                () -> new IdInvalidException("Address with id: '" + id + "' not found")
        );
        return addressMapper.mapToUpdateAddressDTO(address);
    }

    public ResPaginationDTO getAllAddress(Pageable pageable) {
        FilterNode node = filterParser.parse("deleted=false");
        FilterSpecification<Address> spec = filterSpecificationConverter.convert(node);

        Page<Address> pageAddress = addressRepository.findAll(spec, pageable);
        return PaginationUtil.getPaginatedResult(pageAddress, pageable, addressMapper::mapToAddressDTO);
    }

    public Void restoreAddress(String id) throws IdInvalidException {
        Address dbAddress = getAddressByIdAdmin(id).toBuilder()
                .deleted(false)
                .build();
        addressRepository.save(dbAddress);
        return null;
    }

    public Void deleteAddress(String id) throws IdInvalidException {
        Address dbAddress = getAddressByIdAdmin(id).toBuilder()
            .deleted(true)
            .build();
        addressRepository.save(dbAddress);
        return null;
    }

    public ResUpdateAddressDTO updateAddress(Address address, String id) throws IdInvalidException {
        Address dbAddress = getAddressById(id).toBuilder()
                .street(address.getStreet())
                .ward(address.getWard())
                .district(address.getDistrict())
                .city(address.getCity())
                .build();
        if (address.getUser() != null) {
            User user = userService.fetchUserById(address.getUser().getUserId());
            dbAddress.setUser(user);
        }

        Address updatedAddress = addressRepository.save(dbAddress);
        return addressMapper.mapToUpdateAddressDTO(updatedAddress);
    }

    public ResCreateAddressDTO createAddress(Address address) throws IdInvalidException {
        if (address.getUser() != null) {
            User user = userService.fetchUserById(address.getUser().getUserId());
            address.setUser(user);
        }

        Address newAddress = addressRepository.save(address);
        return addressMapper.mapToCreateAddressDTO(newAddress);
    }

    public ResPaginationDTO getAddressByUserId(Pageable pageable,String id) throws IdInvalidException {
        userService.fetchUserById(id);

        FilterNode node = filterParser.parse("deleted=false and user.id='" + id + "'");
        FilterSpecification<Address> spec = filterSpecificationConverter.convert(node);

        Page<Address> pageAddress = addressRepository.findAll(spec, pageable);
        return PaginationUtil.getPaginatedResult(pageAddress, pageable, addressMapper::mapToAddressDTO);
    }
}
