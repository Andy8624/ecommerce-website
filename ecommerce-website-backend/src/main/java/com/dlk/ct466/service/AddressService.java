package com.dlk.ct466.service;

import com.dlk.ct466.domain.entity.Address;
import com.dlk.ct466.domain.entity.User;
import com.dlk.ct466.domain.mapper.AddressMapper;
import com.dlk.ct466.domain.response.ResPaginationDTO;
import com.dlk.ct466.domain.response.address.ResAddressDTO;
import com.dlk.ct466.domain.response.address.ResCreateAddressDTO;
import com.dlk.ct466.domain.response.address.ResUpdateAddressDTO;
import com.dlk.ct466.repository.AddressRepository;
import com.dlk.ct466.util.PaginationUtil;
import com.dlk.ct466.util.error.IdInvalidException;
import com.turkraft.springfilter.converter.FilterSpecification;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;
import com.turkraft.springfilter.parser.FilterParser;
import com.turkraft.springfilter.parser.node.FilterNode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {
    private final AddressRepository addressRepository;
    private final FilterParser filterParser;
    private final FilterSpecificationConverter filterSpecificationConverter;
    private final UserService userService;

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
        return AddressMapper.mapToUpdateAddressDTO(address);
    }

    public ResPaginationDTO getAllAddress(Pageable pageable) {
        FilterNode node = filterParser.parse("deleted=false");
        FilterSpecification<Address> spec = filterSpecificationConverter.convert(node);

        Page<Address> pageAddress = addressRepository.findAll(spec, pageable);
        return PaginationUtil.getPaginatedResult(pageAddress, pageable, AddressMapper::mapToAddressDTO);
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
        return AddressMapper.mapToUpdateAddressDTO(updatedAddress);
    }

    public ResCreateAddressDTO createAddress(Address address) throws IdInvalidException {
        if (address.getUser() != null) {
            User user = userService.fetchUserById(address.getUser().getUserId());
            address.setUser(user);
        }

        Address newAddress = addressRepository.save(address);
        return AddressMapper.mapToCreateAddressDTO(newAddress);
    }

    public ResPaginationDTO getAddressByUserId(Pageable pageable,String id) throws IdInvalidException {
        userService.fetchUserById(id);

        FilterNode node = filterParser.parse("deleted=false and user.id='" + id + "'");
        FilterSpecification<Address> spec = filterSpecificationConverter.convert(node);

        Page<Address> pageAddress = addressRepository.findAll(spec, pageable);
        return PaginationUtil.getPaginatedResult(pageAddress, pageable, AddressMapper::mapToAddressDTO);
    }
}
