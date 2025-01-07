package com.dlk.ct466.service;

import com.dlk.ct466.domain.entity.Address;
import com.dlk.ct466.domain.entity.Order;
import com.dlk.ct466.domain.entity.PaymentMethod;
import com.dlk.ct466.domain.entity.User;
import com.dlk.ct466.domain.mapper.AddressMapper;
import com.dlk.ct466.domain.mapper.OrderMapper;
import com.dlk.ct466.domain.response.ResPaginationDTO;
import com.dlk.ct466.domain.response.order.ResCreateOrderDTO;
import com.dlk.ct466.domain.response.order.ResOrderDTO;
import com.dlk.ct466.domain.response.order.ResUpdateOrderDTO;
import com.dlk.ct466.repository.OrderRepository;
import com.dlk.ct466.util.PaginationUtil;
import com.dlk.ct466.util.constant.OrderStatusEnum;
import com.dlk.ct466.util.error.EnumNameNotValidException;
import com.dlk.ct466.util.error.IdInvalidException;
import com.turkraft.springfilter.converter.FilterSpecification;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;
import com.turkraft.springfilter.parser.FilterParser;
import com.turkraft.springfilter.parser.node.FilterNode;
import jakarta.persistence.Id;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserService userService;
    private final PaymentMethodService paymentMethodService;
    private final AddressService addressService;

    public Order getOrderById(String id) throws IdInvalidException {
        return orderRepository.findById(id).orElseThrow(
                () -> new IdInvalidException("Order id: " + id + " not found")
        );
    }

    public ResOrderDTO getOrderByIdDTO(String id) throws IdInvalidException {
        Order order = orderRepository.findById(id).orElseThrow(
                () -> new IdInvalidException("Order id: " + id + " not found")
        );
        return OrderMapper.mapToResOrderDTO(order);
    }


    public ResCreateOrderDTO createOrder(Order order) throws IdInvalidException {
        if (order == null) {
            throw new IdInvalidException("Order must not be null");
        }

        if (order.getUser() != null && order.getUser().getUserId() != null) {
            User user = userService.fetchUserById(order.getUser().getUserId());
            if (!user.isActive()) {
                throw new IdInvalidException("User with id: '" + user.getUserId() + "' is not active");
            }
            order.setUser(user);
        } else {
            throw new IdInvalidException("User could not be null or empty");
        }

        if (order.getPaymentMethod() != null && order.getPaymentMethod().getPaymentMethodId() != 0) {
            PaymentMethod paymentMethod =
                    paymentMethodService.getPaymentMethodById(order.getPaymentMethod().getPaymentMethodId());
            if (!paymentMethod.isActive()) {
                throw new IdInvalidException("Payment method id: " + paymentMethod.getPaymentMethodId() + " is not active");
            }
            order.setPaymentMethod(paymentMethod);
        } else {
            throw new IdInvalidException("Payment method could not be null or empty");
        }

        if (order.getAddress() != null && order.getAddress().getAddressId() != null) {
            Address address = addressService.getAddressById(order.getAddress().getAddressId());
            order.setAddress(address);
        } else {
            throw new IdInvalidException("Address could not be null or empty");
        }

        if (order.getStatus() == null || String.valueOf(order.getStatus()).trim().isEmpty()) {
            throw new IdInvalidException("Order status cannot be null or empty");
        }
        try {
            // Gọi từ giá trị để xác thực enum
            OrderStatusEnum status = OrderStatusEnum.fromValue(String.valueOf(order.getStatus()));
            order.setStatus(status); // Nếu cần gán lại giá trị
        } catch (EnumNameNotValidException e) {
            throw new IdInvalidException("Invalid order status: " + order.getStatus() + ". " + e.getMessage());
        }



        Order newOrder =  orderRepository.save(order);
        return OrderMapper.mapToResCreateOrderDTO(newOrder);
    }

    public ResUpdateOrderDTO updateOrder(Order order, String id) throws IdInvalidException {
        Order dbOrder = getOrderById(id);
        if (order == null) {
            throw new IdInvalidException("Order must not be null");
        }

        if (order.getUser() != null && order.getUser().getUserId() != null) {
            User user = userService.fetchUserById(order.getUser().getUserId());
            if (!user.isActive()) {
                throw new IdInvalidException("User with id: '" + user.getUserId() + "' is not active");
            }
            dbOrder.setUser(user);
        } else {
            throw new IdInvalidException("User could not be null or empty");
        }

        if (order.getPaymentMethod() != null && order.getPaymentMethod().getPaymentMethodId() != 0) {
            PaymentMethod paymentMethod =
                    paymentMethodService.getPaymentMethodById(order.getPaymentMethod().getPaymentMethodId());
            if (!paymentMethod.isActive()) {
                throw new IdInvalidException("Payment method id: " + paymentMethod.getPaymentMethodId() + " is not active");
            }
            dbOrder.setPaymentMethod(paymentMethod);
        } else {
            throw new IdInvalidException("Payment method could not be null or empty");
        }

        if (order.getAddress() != null && order.getAddress().getAddressId() != null) {
            Address address = addressService.getAddressById(order.getAddress().getAddressId());
            dbOrder.setAddress(address);
        } else {
            throw new IdInvalidException("Address could not be null or empty");
        }

        if (order.getStatus() == null || String.valueOf(order.getStatus()).trim().isEmpty()) {
            throw new IdInvalidException("Order status cannot be null or empty");
        }
        try {
            // Gọi từ giá trị để xác thực enum
            OrderStatusEnum status = OrderStatusEnum.fromValue(String.valueOf(order.getStatus()));
            dbOrder.setStatus(status); // Nếu cần gán lại giá trị
        } catch (EnumNameNotValidException e) {
            throw new IdInvalidException("Invalid order status: " + order.getStatus() + ". " + e.getMessage());
        }

        dbOrder.setShippingCost(order.getShippingCost());

        Order updatedOrder =  orderRepository.save(dbOrder);
        return OrderMapper.mapToResUpdateOrderDTO(updatedOrder);
    }

    public ResPaginationDTO getAllOrder(Pageable pageable) {
        Page<Order> pageOrder = orderRepository.findAll(pageable);
        return PaginationUtil.getPaginatedResult(pageOrder, pageable, OrderMapper::mapToResOrderDTO);
    }

    public List<ResOrderDTO> getOrderByUserId(String userId) throws IdInvalidException {
        userService.fetchUserById(userId);
        List<Order> dbOrder = orderRepository.findByUserUserId(userId);
        return dbOrder.stream()
                .map(OrderMapper::mapToResOrderDTO)
                .collect(Collectors.toList());
    }

    public List<ResOrderDTO> getOrderByAddressId(String addressId) throws IdInvalidException {
        addressService.getAddressById(addressId);
        List<Order> dbOrder = orderRepository.findByAddressAddressId(addressId);
        return dbOrder.stream()
                .map(OrderMapper::mapToResOrderDTO)
                .collect(Collectors.toList());
    }

    public List<ResOrderDTO> getOrderByPaymentMethodId(long id) throws IdInvalidException {
        paymentMethodService.getPaymentMethodById(id);
        List<Order> dbOrder = orderRepository.findByPaymentMethodPaymentMethodId(id);
        return dbOrder.stream()
                .map(OrderMapper::mapToResOrderDTO)
                .collect(Collectors.toList());
    }

    public List<ResOrderDTO> getOrderByStatus(OrderStatusEnum status) {
        List<Order> dbOrder = orderRepository.findByStatus(status);
        return dbOrder.stream()
                .map(OrderMapper::mapToResOrderDTO)
                .collect(Collectors.toList());
    }
}
