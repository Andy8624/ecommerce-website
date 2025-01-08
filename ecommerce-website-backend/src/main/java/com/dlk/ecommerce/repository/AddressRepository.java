package com.dlk.ecommerce.repository;

import com.dlk.ecommerce.domain.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, String>,
        JpaSpecificationExecutor<Address> {
    Optional<Address> findByAddressId(String id);

    @Query("SELECT a FROM Address a WHERE a.addressId = :id AND a.deleted = false")
    Optional<Address> findByAddressIdNotDeleted(@Param("id") String id);


}
