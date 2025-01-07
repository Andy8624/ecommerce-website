package com.dlk.ct466.domain.mapper;

import com.dlk.ct466.domain.entity.Address;
import com.dlk.ct466.domain.entity.Order;
import com.dlk.ct466.domain.entity.PaymentMethod;
import com.dlk.ct466.domain.entity.User;
import com.dlk.ct466.domain.response.order.ResCreateOrderDTO;
import com.dlk.ct466.domain.response.order.ResOrderDTO;
import com.dlk.ct466.domain.response.order.ResUpdateOrderDTO;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {
    public static ResCreateOrderDTO mapToResCreateOrderDTO(Order order) {
        // Map User
        User user = order.getUser();
        ResCreateOrderDTO.UserOrder userOrder = new ResCreateOrderDTO.UserOrder();
        userOrder.setId(user.getUserId());
        userOrder.setFullName(user.getFullName());

        // Map Address
        Address address = order.getAddress();
        ResCreateOrderDTO.AddressOrder addressOrder = new ResCreateOrderDTO.AddressOrder();
        addressOrder.setId(address.getAddressId());
        addressOrder.setAddress(address.getStreet() + ", " + address.getWard() + ", " +
                address.getDistrict() + ", " + address.getCity());

        // Map Payment Method
        PaymentMethod paymentMethod = order.getPaymentMethod();
        ResCreateOrderDTO.PaymentMethodOrder paymentMethodOrder = new ResCreateOrderDTO.PaymentMethodOrder();
        paymentMethodOrder.setId(paymentMethod.getPaymentMethodId());
        paymentMethodOrder.setName(paymentMethod.getName());



        return ResCreateOrderDTO.builder()
                .orderId(order.getOrderId())
                .shippingCost(order.getShippingCost())
                .status(order.getStatus())
                .user(userOrder)
                .address(addressOrder)
                .paymentMethod(paymentMethodOrder)
                .createdAt(order.getCreatedAt())
                .createdBy(order.getCreatedBy())
                .type(order.getType())
                .build();
    }

    public static ResUpdateOrderDTO mapToResUpdateOrderDTO(Order order) {
        // Map User
        User user = order.getUser();
        ResUpdateOrderDTO.UserOrder userOrder = new ResUpdateOrderDTO.UserOrder();
        userOrder.setId(user.getUserId());
        userOrder.setFullName(user.getFullName());

        // Map Address
        Address address = order.getAddress();
        ResUpdateOrderDTO.AddressOrder addressOrder = new ResUpdateOrderDTO.AddressOrder();
        addressOrder.setId(address.getAddressId());
        addressOrder.setAddress(address.getStreet() + ", " + address.getWard() + ", " +
                address.getDistrict() + ", " + address.getCity());

        // Map Payment Method
        PaymentMethod paymentMethod = order.getPaymentMethod();
        ResUpdateOrderDTO.PaymentMethodOrder paymentMethodOrder = new ResUpdateOrderDTO.PaymentMethodOrder();
        paymentMethodOrder.setId(paymentMethod.getPaymentMethodId());
        paymentMethodOrder.setName(paymentMethod.getName());



        return ResUpdateOrderDTO.builder()
                .orderId(order.getOrderId())
                .shippingCost(order.getShippingCost())
                .status(order.getStatus())
                .user(userOrder)
                .address(addressOrder)
                .paymentMethod(paymentMethodOrder)
                .updatedAt(order.getCreatedAt())
                .updatedBy(order.getCreatedBy())
                .build();
    }

    public static ResOrderDTO mapToResOrderDTO(Order order) {
        // Map User
        User user = order.getUser();
        ResOrderDTO.UserOrder userOrder = new ResOrderDTO.UserOrder();
        userOrder.setId(user.getUserId());
        userOrder.setFullName(user.getFullName());

        // Map Address
        Address address = order.getAddress();
        ResOrderDTO.AddressOrder addressOrder = new ResOrderDTO.AddressOrder();
        addressOrder.setId(address.getAddressId());
        addressOrder.setAddress(address.getStreet() + ", " + address.getWard() + ", " +
                address.getDistrict() + ", " + address.getCity());

        // Map Payment Method
        PaymentMethod paymentMethod = order.getPaymentMethod();
        ResOrderDTO.PaymentMethodOrder paymentMethodOrder = new ResOrderDTO.PaymentMethodOrder();
        paymentMethodOrder.setId(paymentMethod.getPaymentMethodId());
        paymentMethodOrder.setName(paymentMethod.getName());



        return ResOrderDTO.builder()
                .orderId(order.getOrderId())
                .shippingCost(order.getShippingCost())
                .status(order.getStatus())
                .user(userOrder)
                .address(addressOrder)
                .paymentMethod(paymentMethodOrder)
                .createdAt(order.getCreatedAt())
                .createdBy(order.getCreatedBy())
                .updatedAt(order.getCreatedAt())
                .updatedBy(order.getCreatedBy())
                .type(order.getType())
                .build();
    }
}
