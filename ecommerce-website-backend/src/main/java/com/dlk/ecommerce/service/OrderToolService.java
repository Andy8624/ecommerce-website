package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.Order;
import com.dlk.ecommerce.domain.entity.OrderTool;
import com.dlk.ecommerce.domain.entity.Tool;
import com.dlk.ecommerce.domain.mapper.OrderToolMapper;
import com.dlk.ecommerce.domain.request.orderTool.OrderToolRequest;
import com.dlk.ecommerce.domain.request.orderTool.ReqOrderToolDTO;
import com.dlk.ecommerce.domain.response.ResPaginationDTO;
import com.dlk.ecommerce.domain.response.orderTool.ResCreateOrderToolDTO;
import com.dlk.ecommerce.domain.response.orderTool.ResOrderToolDTO;
import com.dlk.ecommerce.domain.response.orderTool.ResUpdateOrderToolDTO;
import com.dlk.ecommerce.repository.OrderToolRepository;
import com.dlk.ecommerce.util.PaginationUtil;
import com.dlk.ecommerce.util.error.IdInvalidException;
import com.dlk.ecommerce.util.helper.LogFormatter;
import com.turkraft.springfilter.converter.FilterSpecification;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;
import com.turkraft.springfilter.parser.FilterParser;
import com.turkraft.springfilter.parser.node.FilterNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderToolService {
    private final OrderToolRepository orderToolRepository;
//    private final OrderService orderService;
    private final ToolService toolService;
    private final FilterParser filterParser;
    private final FilterSpecificationConverter filterSpecificationConverter;
    private final OrderToolMapper orderToolMapper;
    private final ProductVariantService productVariantService;
    private final CartToolService cartToolService;

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

    public Boolean createOrderTool(OrderToolRequest request, Order order) throws IdInvalidException {
        if (request == null) {
            throw new IdInvalidException("Order tool request cannot be null");
        }

        Tool tool = toolService.getToolById(request.getToolId());

        // Check if variantDetail1 exists before accessing its properties
        Integer stockDB;
        if (request.getVariantDetail1() != null) {
            String productVariantId = request.getVariantDetail1().getProduct_variant_id();
            if (productVariantId != null) {
                // If we have a second variant, get stock from product variant service
                stockDB = productVariantService.getStockById(productVariantId);
                LogFormatter.logFormattedRequest("Stock", stockDB);
            } else {
                // If no product variant ID is found, fall back to tool stock
                stockDB = tool.getStockQuantity();
            }
        } else {
            // If no variant details at all, use tool stock
            stockDB = tool.getStockQuantity();
        }

        if (stockDB < request.getQuantity()) {
            return false;
        } else {
            // Co phan loai
            if (request.getVariantDetail1() != null && request.getVariantDetail1().getProduct_variant_id() != null) {
                productVariantService.reduceStock(request.getVariantDetail1().getProduct_variant_id(), request.getQuantity());
            } else {
                // Khong phan loai
                int newStock = tool.getStockQuantity() - request.getQuantity();
                tool.setStockQuantity(newStock);
                toolService.updateStockQuantity(tool.getToolId(), newStock);
            }

            // Vi neu tao chi tiet order thanh cong roi moi xoa san pham gio han    g
            // Nen khong can phai rollback
            // Xoa san pham da mua khoi gio hang
            cartToolService.deleteCartTool(request.getId());
        }

        OrderTool orderTool = new OrderTool().toBuilder()
                .name(request.getName())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                // VariantDetail1
                .variantDetailId1(request.getVariantDetail1() != null ? request.getVariantDetail1().getId() : null)
                .product_variant_id_1(request.getVariantDetail1() != null ? request.getVariantDetail1().getProduct_variant_id() : null)
                .category_detail_id_1(request.getVariantDetail1() != null ? request.getVariantDetail1().getCategory_detail_id() : null)
                .category_name_1(request.getVariantDetail1() != null ? request.getVariantDetail1().getCategory_name() : null)
                .category_detail_name_1(request.getVariantDetail1() != null ? request.getVariantDetail1().getCategory_detail_name() : null)

                // VariantDetail2
                .variantDetailId2(request.getVariantDetail2() != null ? request.getVariantDetail2().getId() : null)
                .product_variant_id_2(request.getVariantDetail2() != null ? request.getVariantDetail2().getProduct_variant_id() : null)
                .category_detail_id_2(request.getVariantDetail2() != null ? request.getVariantDetail2().getCategory_detail_id() : null)
                .category_name_2(request.getVariantDetail2() != null ? request.getVariantDetail2().getCategory_name() : null)
                .category_detail_name_2(request.getVariantDetail2() != null ? request.getVariantDetail2().getCategory_detail_name() : null)

                .tool(tool)
                .order(order)
                .build();

        OrderTool orderToolNew = orderToolRepository.save(orderTool);
        LogFormatter.logFormattedRequest("orderToolNew", orderToolNew);
        return true;
    }
//
//    public ResUpdateOrderToolDTO updateOrderTool(ReqOrderToolDTO request, String id) throws IdInvalidException {
//        OrderTool dbOrderTool = getOrderToolById(id);
//
//        // chắc không ai có thể đổi đc order từ người này sang người kia đâu :)))
//        Order newOrder = orderService.getOrderById(request.getOrder().getOrderId());
//        dbOrderTool.setOrder(newOrder);
//
//        Tool newTool = toolService.getToolById(request.getTool().getToolId());
//        if (dbOrderTool.getTool().getToolId() != newTool.getToolId()) {
//            // Kiểm tra xem ToolId mới đã tồn tại trong OrderTool với cùng OrderId hay chưa
//            Optional<OrderTool> existingOrderTool =
//                    orderToolRepository.findByOrderOrderIdAndToolToolId(
//                            newOrder.getOrderId(),
//                            newTool.getToolId()
//                    );
//
//            if (existingOrderTool.isPresent()) {
//                // Nếu Tool đã tồn tại với Order này -> tăng số lượng lên
//                OrderTool existOrderTool = existingOrderTool.get();
//                existOrderTool.setQuantity(existOrderTool.getQuantity() + request.getQuantity());
//
//                OrderTool updatedOrderTool = orderToolRepository.save(existOrderTool);
//                return orderToolMapper.mapToUpdateOrderToolDTO(updatedOrderTool);
//            } else {
//                // Nếu không có OrderTool tồn tại với Tool mới, cập nhật Tool cho dbOrderTool hiện tại
//                dbOrderTool.setTool(newTool);
//            }
//        }
//
//        dbOrderTool.setQuantity(request.getQuantity());
//
//        OrderTool updatedOrderTool = orderToolRepository.save(dbOrderTool);
//
//        return orderToolMapper.mapToUpdateOrderToolDTO(updatedOrderTool);
//    }

    public ResPaginationDTO getAllOrderTools(Pageable pageable) {

        Page<OrderTool> pageOrderTool = orderToolRepository.findAll(pageable);
        return PaginationUtil.getPaginatedResult(pageOrderTool, pageable, orderToolMapper::mapToOrderToolDTO);
    }

    public ResPaginationDTO getOrderToolsByOrderId(Pageable pageable, String orderId) throws IdInvalidException {
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
