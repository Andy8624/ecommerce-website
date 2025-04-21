package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.*;
import com.dlk.ecommerce.domain.mapper.OrderMapper;
import com.dlk.ecommerce.domain.request.order.CreateOrderRequest;
import com.dlk.ecommerce.domain.request.order.OrderStatusRequest;
import com.dlk.ecommerce.domain.request.orderTool.OrderToolRequest;
import com.dlk.ecommerce.domain.response.ResPaginationDTO;
import com.dlk.ecommerce.domain.response.order.ResCreateOrderDTO;
import com.dlk.ecommerce.domain.response.order.ResOrderDTO;
import com.dlk.ecommerce.domain.response.order.ResUpdateOrderDTO;
import com.dlk.ecommerce.domain.response.orderTool.ResCreateOrderToolDTO;
import com.dlk.ecommerce.repository.OrderRepository;
import com.dlk.ecommerce.util.PaginationUtil;
import com.dlk.ecommerce.util.constant.OrderStatusEnum;
import com.dlk.ecommerce.util.error.EnumNameNotValidException;
import com.dlk.ecommerce.util.error.IdInvalidException;
import com.dlk.ecommerce.util.helper.LogFormatter;
import com.turkraft.springfilter.converter.FilterSpecification;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;
import com.turkraft.springfilter.parser.FilterParser;
import com.turkraft.springfilter.parser.node.FilterNode;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserService userService;
    private final PaymentMethodService paymentMethodService;
    private final AddressService addressService;
    private final OrderMapper orderMapper;
    private final OrderToolService orderToolService;
    private final FilterParser filterParser;
    private final FilterSpecificationConverter filterSpecificationConverter;


    public Order getOrderById(String id) throws IdInvalidException {
        return orderRepository.findById(id).orElseThrow(
                () -> new IdInvalidException("Order id: " + id + " not found")
        );
    }

    public ResOrderDTO getOrderByIdDTO(String id) throws IdInvalidException {
        Order order = orderRepository.findById(id).orElseThrow(
                () -> new IdInvalidException("Order id: " + id + " not found")
        );
        return orderMapper.mapToResOrderDTO(order);
    }

    @Transactional
    public CreateOrderRequest createOrder(CreateOrderRequest order) throws IdInvalidException {
//        LogFormatter.logFormattedRequest("Order", order.getOrderTools());
//        LogFormatter.logFormattedRequest("User", order.getUser().getUserId());
//        LogFormatter.logFormattedRequest("Address", order.getAddress());
//        LogFormatter.logFormattedRequest("PaymentMethod", order.getPaymentMethod());
//        LogFormatter.logFormattedRequest("Status", order.getStatus());
//        LogFormatter.logFormattedRequest("ShippingCost", order.getShippingCost());
//        LogFormatter.logFormattedRequest("CartId", order.getCartId());

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
            OrderStatusEnum status = OrderStatusEnum.fromValue(String.valueOf(order.getStatus()));
            order.setStatus(status);
        } catch (EnumNameNotValidException e) {
            throw new IdInvalidException("Invalid order status: " + order.getStatus() + ". " + e.getMessage());
        }

        Order newOrder = orderRepository.save(Order.builder()
                .shippingCost(order.getShippingCost())
                .status(order.getStatus())
                .user(order.getUser())
                .paymentMethod(order.getPaymentMethod())
                .address(order.getAddress())
                .shopId(order.getShopId())
                .build());
        String orderId = newOrder.getOrderId();
        order.setOrderId(orderId);

        // Process order tools and handle failures
        boolean allOrderToolsCreatedSuccessfully = createAllOrderToolsOrRollback(order.getOrderTools(), newOrder);

        // If any order tool creation failed, throw an exception to trigger transaction rollback
        if (!allOrderToolsCreatedSuccessfully) {
            throw new RuntimeException("Failed to create one or more order tools. The order has been rolled back.");
        }

        return order;
    }

    @Transactional
    public boolean createAllOrderToolsOrRollback(List<OrderToolRequest> orderTools, Order order) throws IdInvalidException {
        boolean allSuccessful = true;
        List<String> failedOrderTools = new ArrayList<>();

        for (OrderToolRequest orderTool : orderTools) {
            try {
                Boolean res = orderToolService.createOrderTool(orderTool, order);

                if (res == null || !res) {
                    allSuccessful = false;
                    failedOrderTools.add(orderTool.toString());
                    throw new RuntimeException("Order created failed because of order tool");
                }
            } catch (Exception e) {
                allSuccessful = false;
                failedOrderTools.add(orderTool.toString() + ": " + e.getMessage());
                log.error("Failed to create order tool: {}", e.getMessage(), e);

                throw new RuntimeException("Order created failed because of order tool");

            }
        }

        if (!allSuccessful) {
            log.error("Order tool creation failed for tools: {}", failedOrderTools);
        }

        return allSuccessful;
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
            dbOrder.setStatus(status);
        } catch (EnumNameNotValidException e) {
            throw new IdInvalidException("Invalid order status: " + order.getStatus() + ". " + e.getMessage());
        }

        dbOrder.setShippingCost(order.getShippingCost());

        Order updatedOrder =  orderRepository.save(dbOrder);
        return orderMapper.mapToResUpdateOrderDTO(updatedOrder);
    }

    public ResPaginationDTO getAllOrder(Pageable pageable) {
        Page<Order> pageOrder = orderRepository.findAll(pageable);
        return PaginationUtil.getPaginatedResult(pageOrder, pageable, orderMapper::mapToResOrderDTO);
    }

    public List<Order> getOrderByUserId(String userId) throws IdInvalidException {
        userService.fetchUserById(userId);
        List<Order> dbOrder = orderRepository.findByUserUserId(userId);
        return dbOrder;
//        return dbOrder.stream()
//                .map(orderMapper::mapToResOrderDTO)
//                .collect(Collectors.toList());
    }

    public List<ResOrderDTO> getOrderByAddressId(String addressId) throws IdInvalidException {
        addressService.getAddressById(addressId);
        List<Order> dbOrder = orderRepository.findByAddressAddressId(addressId);
        return dbOrder.stream()
                .map(orderMapper::mapToResOrderDTO)
                .collect(Collectors.toList());
    }

    public List<ResOrderDTO> getOrderByPaymentMethodId(long id) throws IdInvalidException {
        paymentMethodService.getPaymentMethodById(id);
        List<Order> dbOrder = orderRepository.findByPaymentMethodPaymentMethodId(id);
        return dbOrder.stream()
                .map(orderMapper::mapToResOrderDTO)
                .collect(Collectors.toList());
    }

    public List<ResOrderDTO> getOrderByStatus(OrderStatusEnum status) {
        List<Order> dbOrder = orderRepository.findByStatus(status);
        return dbOrder.stream()
                .map(orderMapper::mapToResOrderDTO)
                .collect(Collectors.toList());
    }

    public ResPaginationDTO getOrderByShopId(Specification<Order> specUser, Pageable pageable, String shopId) {
        FilterNode node = filterParser.parse("shopId='" + shopId + "'");
        FilterSpecification<Order> spec = filterSpecificationConverter.convert(node);
        Specification<Order> combineSpec = Specification.where(spec).and(specUser);

        Page<Order> pageOrders = orderRepository.findAll(combineSpec, pageable);
        return PaginationUtil.getPaginatedResult(pageOrders, pageable);
    }

    public Void updateOrderStatus(String orderId, OrderStatusRequest status) throws IdInvalidException {
//        LogFormatter.logFormattedRequest("status", status);

        Order order = getOrderById(orderId);
//        LogFormatter.logFormattedRequest("order", order);

        order.setStatus(status.getStatus());
        orderRepository.save(order);
        return null;
    }

    public void checkRated(String orderId) throws IdInvalidException {
        Order orderDb = getOrderById(orderId);
        if (!orderDb.getRated()) {
            orderDb.setRated(true);
        }
        orderRepository.save(orderDb);
    }
}
