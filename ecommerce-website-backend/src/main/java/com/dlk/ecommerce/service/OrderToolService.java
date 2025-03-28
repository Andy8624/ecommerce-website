package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.Order;
import com.dlk.ecommerce.domain.entity.OrderTool;
import com.dlk.ecommerce.domain.entity.Tool;
import com.dlk.ecommerce.domain.mapper.OrderToolMapper;
import com.dlk.ecommerce.domain.request.orderTool.ReqOrderToolDTO;
import com.dlk.ecommerce.domain.response.ResPaginationDTO;
import com.dlk.ecommerce.domain.response.orderTool.ResCreateOrderToolDTO;
import com.dlk.ecommerce.domain.response.orderTool.ResOrderToolDTO;
import com.dlk.ecommerce.domain.response.orderTool.ResUpdateOrderToolDTO;
import com.dlk.ecommerce.repository.OrderToolRepository;
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

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderToolService {
    private final OrderToolRepository orderToolRepository;
    private final OrderService orderService;
    private final ToolService toolService;
    private final FilterParser filterParser;
    private final FilterSpecificationConverter filterSpecificationConverter;
    private final OrderToolMapper orderToolMapper;
    public OrderTool getOrderToolById(String id) throws IdInvalidException {
        return orderToolRepository.findById(id).orElseThrow(
                () -> new IdInvalidException("Order tool id: "+ id + " not found")
        );
    }

    public ResOrderToolDTO getOrderToolByIdDTO(String id) throws IdInvalidException {
        OrderTool dbOrderTool = orderToolRepository.findById(id).orElseThrow(
                () -> new IdInvalidException("Order tool id: "+ id + " not found")
        );

        return orderToolMapper.mapToOrderToolDTO(dbOrderTool);
    }

    public ResCreateOrderToolDTO createOrderTool(ReqOrderToolDTO request) throws IdInvalidException {
        Order order = orderService.getOrderById(request.getOrder().getOrderId());

        Tool tool = toolService.getToolById(request.getTool().getToolId());

        Optional<OrderTool> existOrderTool =
                orderToolRepository.findByOrderOrderIdAndToolToolId(
                        order.getOrderId(),
                        tool.getToolId()
                );

        OrderTool orderTool;

        if (existOrderTool.isPresent()) {
            // nếu order đã tồn tại tool thì tăng số lượng lên
            orderTool = existOrderTool.get();
            orderTool.setQuantity(orderTool.getQuantity() + request.getQuantity());
        } else {
            // nếu chưa tồn tại thì tạo mới bình thường
            orderTool = new OrderTool().toBuilder()
                    .quantity(request.getQuantity())
                    .tool(tool)
                    .order(order)
                    .build();
        }

        OrderTool newOrderTool = orderToolRepository.save(orderTool);

        return orderToolMapper.mapToCreateOrderToolDTO(newOrderTool);
    }

    public ResUpdateOrderToolDTO updateOrderTool(ReqOrderToolDTO request, String id) throws IdInvalidException {
        OrderTool dbOrderTool = getOrderToolById(id);

        // chắc không ai có thể đổi đc order từ người này sang người kia đâu :)))
        Order newOrder = orderService.getOrderById(request.getOrder().getOrderId());
        dbOrderTool.setOrder(newOrder);

        Tool newTool = toolService.getToolById(request.getTool().getToolId());
        if (dbOrderTool.getTool().getToolId() != newTool.getToolId()) {
            // Kiểm tra xem ToolId mới đã tồn tại trong OrderTool với cùng OrderId hay chưa
            Optional<OrderTool> existingOrderTool =
                    orderToolRepository.findByOrderOrderIdAndToolToolId(
                            newOrder.getOrderId(),
                            newTool.getToolId()
                    );

            if (existingOrderTool.isPresent()) {
                // Nếu Tool đã tồn tại với Order này -> tăng số lượng lên
                OrderTool existOrderTool = existingOrderTool.get();
                existOrderTool.setQuantity(existOrderTool.getQuantity() + request.getQuantity());

                OrderTool updatedOrderTool = orderToolRepository.save(existOrderTool);
                return orderToolMapper.mapToUpdateOrderToolDTO(updatedOrderTool);
            } else {
                // Nếu không có OrderTool tồn tại với Tool mới, cập nhật Tool cho dbOrderTool hiện tại
                dbOrderTool.setTool(newTool);
            }
        }

        dbOrderTool.setQuantity(request.getQuantity());

        OrderTool updatedOrderTool = orderToolRepository.save(dbOrderTool);

        return orderToolMapper.mapToUpdateOrderToolDTO(updatedOrderTool);
    }

    public ResPaginationDTO getAllOrderTools(Pageable pageable) {

        Page<OrderTool> pageOrderTool = orderToolRepository.findAll(pageable);
        return PaginationUtil.getPaginatedResult(pageOrderTool, pageable, orderToolMapper::mapToOrderToolDTO);
    }

    public ResPaginationDTO getOrderToolsByOrderId(Pageable pageable, String orderId) throws IdInvalidException {
        orderService.getOrderById(orderId);

        FilterNode node = filterParser.parse("order.id='" + orderId + "'");
        FilterSpecification<OrderTool> spec = filterSpecificationConverter.convert(node);

        Page<OrderTool> pageOrderTool = orderToolRepository.findAll(spec, pageable);
        return PaginationUtil.getPaginatedResult(pageOrderTool, pageable, orderToolMapper::mapToOrderToolDTO);
    }

    public ResPaginationDTO getOrderToolsByToolId(Pageable pageable, long toolId) throws IdInvalidException {
        toolService.getToolById(toolId);

        FilterNode node = filterParser.parse("tool.id=" + toolId);
        FilterSpecification<OrderTool> spec = filterSpecificationConverter.convert(node);

        Page<OrderTool> pageOrderTool = orderToolRepository.findAll(spec, pageable);
        return PaginationUtil.getPaginatedResult(pageOrderTool, pageable, orderToolMapper::mapToOrderToolDTO);
    }

    public Integer getTotalSoldQuantity(Long toolId) {
        return orderToolRepository.sumQuantityByToolIdAndOrderStatusSuccess(toolId);
    }
}
