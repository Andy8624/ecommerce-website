package com.dlk.ecommerce.domain.mapper;

import com.dlk.ecommerce.domain.entity.Address;
import com.dlk.ecommerce.domain.entity.Order;
import com.dlk.ecommerce.domain.entity.PaymentMethod;
import com.dlk.ecommerce.domain.entity.User;
import com.dlk.ecommerce.domain.response.order.ResCreateOrderDTO;
import com.dlk.ecommerce.domain.response.order.ResOrderDTO;
import com.dlk.ecommerce.domain.response.order.ResUpdateOrderDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(target = "address", expression = "java(mapToGeneric(order.getAddress(), ResCreateOrderDTO.AddressOrder.class))")
    @Mapping(target = "user", expression = "java(mapToGeneric(order.getUser(), ResCreateOrderDTO.UserOrder.class))")
    @Mapping(target = "paymentMethod", expression = "java(mapToGeneric(order.getPaymentMethod(), ResCreateOrderDTO.PaymentMethodOrder.class))")
    ResCreateOrderDTO mapToResCreateOrderDTO(Order order);

    @Mapping(target = "address", expression = "java(mapToGeneric(order.getAddress(), ResUpdateOrderDTO.AddressOrder.class))")
    @Mapping(target = "user", expression = "java(mapToGeneric(order.getUser(), ResUpdateOrderDTO.UserOrder.class))")
    @Mapping(target = "paymentMethod", expression = "java(mapToGeneric(order.getPaymentMethod(), ResUpdateOrderDTO.PaymentMethodOrder.class))")
    ResUpdateOrderDTO mapToResUpdateOrderDTO(Order order);

    @Mapping(target = "address", expression = "java(mapToGeneric(order.getAddress(), ResOrderDTO.AddressOrder.class))")
    @Mapping(target = "user", expression = "java(mapToGeneric(order.getUser(), ResOrderDTO.UserOrder.class))")
    @Mapping(target = "paymentMethod", expression = "java(mapToGeneric(order.getPaymentMethod(), ResOrderDTO.PaymentMethodOrder.class))")
    ResOrderDTO mapToResOrderDTO(Order order);

    // Generic function for mapping Address, User, and PaymentMethod
    @Named("mapToGeneric")
    default <T, E> T mapToGeneric(E entity, Class<T> targetClass) {
        if (entity == null) {
            return null;
        }

        try {
            switch (entity) {
                case Address address -> {
                    String addressString = String.format("%s, %s, %s, %s",
                            address.getStreet(), address.getWard(), address.getDistrict(), address.getCity());
                    return targetClass.getConstructor(String.class, String.class)
                            .newInstance(address.getAddressId(), addressString);
                }
                case User user -> {
                    return targetClass.getConstructor(String.class, String.class)
                            .newInstance(user.getUserId(), user.getFullName());
                }
                case PaymentMethod paymentMethod -> {
                    return targetClass.getConstructor(Long.TYPE, String.class)
                            .newInstance(paymentMethod.getPaymentMethodId(), paymentMethod.getName());
                }
                default -> {
                }
            }
        } catch (ReflectiveOperationException e) {
            throw new IllegalArgumentException("Cannot map entity to " + targetClass.getName(), e);
        }

        throw new IllegalArgumentException("Unsupported entity type: " + entity.getClass().getName());
    }
}
