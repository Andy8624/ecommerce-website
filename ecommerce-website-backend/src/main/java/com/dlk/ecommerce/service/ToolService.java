package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.ProductAttributes;
import com.dlk.ecommerce.domain.entity.Tool;
import com.dlk.ecommerce.domain.entity.ToolType;
import com.dlk.ecommerce.domain.entity.User;
import com.dlk.ecommerce.domain.mapper.ToolMapper;
import com.dlk.ecommerce.domain.request.product_attributes.ProductAttributesRequest;
import com.dlk.ecommerce.domain.request.tool.ReqToolDTO;
import com.dlk.ecommerce.domain.response.ResPaginationDTO;
import com.dlk.ecommerce.domain.response.recommendation.CBFResponse;
import com.dlk.ecommerce.domain.response.tool.ResCreateToolDTO;
import com.dlk.ecommerce.domain.response.tool.ResToolDTO;
import com.dlk.ecommerce.domain.response.tool.ResUpdateToolDTO;
import com.dlk.ecommerce.repository.ToolRepository;
import com.dlk.ecommerce.util.PaginationUtil;
import com.dlk.ecommerce.util.error.IdInvalidException;
import com.dlk.ecommerce.util.helper.LogFormatter;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ToolService {
    private final ToolRepository toolRepository;
    private final FilterParser filterParser;
    private final FilterSpecificationConverter filterSpecificationConverter;
    private final UserService userService;
    private final ToolTypeService toolTypeService;
    private final ToolMapper toolMapper;
    private final ProductAttributeService productAttributeService;
    private final CategoryDetailService categoryDetailService;
    private final CategoryService categoryService;
    // private final ProductVariantService productVariantService;

    public Tool getToolById(long toolId) throws IdInvalidException {
        return toolRepository.findByIdIfNotDeleted(toolId).orElseThrow(
                () -> new IdInvalidException("Tool with id: " + toolId + " not found"));
    }

    public Tool getToolByIdForUpdate(long toolId) throws IdInvalidException {
        return toolRepository.findByIdIfNotDeletedForUpdate(toolId).orElse(null);
    }

    public ResToolDTO getToolByIdDTO(long toolId) throws IdInvalidException {
        Tool tool = toolRepository.findByIdIfNotDeleted(toolId).orElseThrow(
                () -> new IdInvalidException("Tool with id: " + toolId + " not found"));
        return toolMapper.mapToResToolDTO(tool);
    }

    public ResCreateToolDTO createTool(ReqToolDTO request) throws IdInvalidException, JsonProcessingException {
        User dbUser = userService.fetchUserById(request.getUser().getUserId());
        ToolType dbToolType = toolTypeService.getToolTypeById(request.getToolType().getToolTypeId());

        // LogFormatter.logFormattedRequest("Request tạo sp", request);

        Tool tool = new Tool().toBuilder()
                .user(dbUser)
                .toolType(dbToolType)
                .brand(request.getBrand())
                .description(request.getDescription())
                .name(request.getName())
                .origin(request.getOrigin())
                .warranty(request.getWarranty())
                .length(request.getLength())
                .width(request.getWidth())
                .height(request.getHeight())
                .weight(request.getWeight())
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .price(request.getPrice())
                .discountedPrice(BigDecimal.valueOf(0))
                .isActive(true)
                .build();
        Tool newTool = toolRepository.save(tool);

        // Tạo thông tin loại sản phẩm (Màu: Đỏ, Xanh, ...) (Kích thước: 1m, 2m, ...)
        // Trong đó có số lượng và giá của từng loại
        categoryService.createCategory(
                request.getCategoryDetails().getCategory(),
                newTool,
                request.getCategoryDetails().getCategoryDetail());

        if (request.getAttributes() != null) {
            ProductAttributesRequest attrRequest = new ProductAttributesRequest(
                    newTool.getToolId(),
                    request.getAttributes());
            List<ProductAttributes> attr = productAttributeService.addAttributes(attrRequest);
        }

        return toolMapper.mapToResCreateToolDTO(newTool);
    }

    @Transactional
    public ResUpdateToolDTO updateTool(ReqToolDTO request, long id) throws IdInvalidException {
        LogFormatter.logFormattedRequest("Request update :", request);

        // Lấy thông tin người dùng và loại sản phẩm
        User dbUser = userService.fetchUserById(request.getUser().getUserId());
        ToolType dbToolType = toolTypeService.getToolTypeById(request.getToolType().getToolTypeId());

        // Lấy thông tin sản phẩm cần cập nhật
        Tool dbTool = getToolById(id);

        // Cập nhật thông tin cơ bản
        Tool updatedTool = dbTool.toBuilder()
                .user(dbUser)
                .toolType(dbToolType)
                .name(request.getName())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .isActive(request.isActive())
                .brand(request.getBrand())
                .origin(request.getOrigin())
                .warranty(request.getWarranty())
                .length(request.getLength())
                .width(request.getWidth())
                .height(request.getHeight())
                .weight(request.getWeight())
                .build();

        // Cập nhật giá và số lượng chỉ khi không có phân loại
        if (request.getCategoryDetails() == null || request.getCategoryDetails().getCategory() == null
                || request.getCategoryDetails().getCategory().isEmpty()) {
            updatedTool.setPrice(request.getPrice());
            updatedTool.setDiscountedPrice(
                    request.getDiscountedPrice() != null ? request.getDiscountedPrice() : BigDecimal.ZERO);
            updatedTool.setStockQuantity(request.getStockQuantity());
        }

        // Lưu thông tin sản phẩm cơ bản
        Tool savedTool = toolRepository.save(updatedTool);

        // Cập nhật thuộc tính sản phẩm nếu có
        // Fix: Chỉ tạo ProductAttributesRequest khi request.getAttributes() không null
        if (request.getAttributes() != null) {
            ProductAttributesRequest attrRequest = new ProductAttributesRequest(
                    savedTool.getToolId(),
                    request.getAttributes());
            productAttributeService.addAttributes(attrRequest);
        }

        // Cập nhật phân loại sản phẩm và biến thể
        if (request.getCategoryDetails() != null && request.getCategoryDetails().getCategory() != null
                && !request.getCategoryDetails().getCategory().isEmpty()) {

            // Cập nhật thay vì xóa và tạo mới
            log.info("Updating existing category details");

            // Cập nhật cấu trúc phân loại nếu có thay đổi (categories và values)
            categoryService.updateCategories(
                    request.getCategoryDetails().getCategory(),
                    savedTool);

            // Cập nhật chi tiết phân loại (giá, số lượng) dựa trên categoryId
            categoryService.updateCategoryDetails(
                    savedTool,
                    request.getCategoryDetails().getCategoryDetail());

            // Cập nhật tổng stock từ các biến thể
            int totalStock = request.getCategoryDetails().getCategoryDetail().stream()
                    .mapToInt(detail -> detail.getStock())
                    .sum();

            log.info("Calculated total stock: {}", totalStock);
            savedTool.setStockQuantity(totalStock);

            // Cập nhật giá cơ bản từ giá thấp nhất của các biến thể
            if (!request.getCategoryDetails().getCategoryDetail().isEmpty()) {
                BigDecimal lowestPrice = request.getCategoryDetails().getCategoryDetail().stream()
                        .map(detail -> detail.getPrice())
                        .min(BigDecimal::compareTo)
                        .orElse(request.getPrice());

                log.info("Found lowest price among variants: {}", lowestPrice);
                savedTool.setPrice(lowestPrice);

                // Nếu có discountedPrice, thì cũng cập nhật giá khuyến mãi thấp nhất
                if (request.getDiscountedPrice() != null) {
                    savedTool.setDiscountedPrice(request.getDiscountedPrice());
                }
            }

            // Lưu lại sản phẩm với stock và price đã cập nhật
            savedTool = toolRepository.save(savedTool);
        }

        log.info("Updated tool with ID {}: price={}, stock={}",
                savedTool.getToolId(), savedTool.getPrice(), savedTool.getStockQuantity());

        return toolMapper.mapToResUpdateToolDTO(savedTool);
    }

    public void updateStockQuantity(long toolId, int quantity) throws IdInvalidException {
        Tool dbTool = getToolById(toolId);
        dbTool.setStockQuantity(quantity);
        toolRepository.save(dbTool);
    }

    public Void hardDeleteTool(Long toolId) throws IdInvalidException {
        Tool dbTool = getToolById(toolId);
        toolRepository.delete(dbTool);
        return null;
    }

    public Void deleteTool(Long toolId) throws IdInvalidException {
        Tool dbTool = getToolById(toolId);
        dbTool.setDeleted(true);
        toolRepository.save(dbTool);
        return null;
    }

    public Void restoreTool(Long toolId) throws IdInvalidException {
        Tool dbTool = getToolById(toolId);
        dbTool.setDeleted(false);
        toolRepository.save(dbTool);
        return null;
    }

    public ResPaginationDTO getAllTool(Specification<Tool> specUser, Pageable pageable) {
        FilterNode node = filterParser.parse("deleted=false");
        FilterSpecification<Tool> spec = filterSpecificationConverter.convert(node);
        // log.info("spec {}", spec);
        Specification<Tool> combineSpec = Specification.where(spec).and(specUser);
        // log.info("combineSpec {}", combineSpec);
        Page<Tool> pageTools = toolRepository.findAll(combineSpec, pageable);
        return PaginationUtil.getPaginatedResult(pageTools, pageable, toolMapper::mapToResToolDTO);
    }

    public ResPaginationDTO getAllToolAdmin(Pageable pageable) {
        Page<Tool> pageTools = toolRepository.findAll(pageable);
        return PaginationUtil.getPaginatedResult(pageTools, pageable, toolMapper::mapToResToolDTO);
    }

    public ResPaginationDTO getToolByUserId(Specification<Tool> specUser, Pageable pageable, String id)
            throws IdInvalidException {
        userService.fetchUserById(id);
        FilterNode node = filterParser.parse("deleted=false and user.id='" + id + "'");
        FilterSpecification<Tool> spec = filterSpecificationConverter.convert(node);
        Specification<Tool> combineSpec = Specification.where(spec).and(specUser);

        Page<Tool> pageTools = toolRepository.findAll(combineSpec, pageable);
        return PaginationUtil.getPaginatedResult(pageTools, pageable, toolMapper::mapToResToolDTO);
    }

    public ResPaginationDTO getToolByTypeId(Pageable pageable, long id) throws IdInvalidException {
        toolTypeService.getToolTypeById(id);
        FilterNode node = filterParser.parse("deleted=false and toolType.id='" + id + "'");
        FilterSpecification<Tool> spec = filterSpecificationConverter.convert(node);

        Page<Tool> pageTools = toolRepository.findAll(spec, pageable);
        return PaginationUtil.getPaginatedResult(pageTools, pageable, toolMapper::mapToResToolDTO);
    }

    public ResPaginationDTO getToolByName(Specification<Tool> spec, Pageable pageable) {
        Page<Tool> pageTools = toolRepository.findAll(spec, pageable);
        return PaginationUtil.getPaginatedResult(pageTools, pageable, toolMapper::mapToResToolDTO);
    }

    public List<ResToolDTO> getToolsByIds(List<Long> toolIds) {
        List<Tool> tools = toolRepository.findAllById(toolIds);
        return tools.stream()
                .map(toolMapper::mapToResToolDTO)
                .collect(Collectors.toList());
    }

    public Integer getStockByToolId(long toolId) {
        Tool tool = toolRepository.findByIdIfNotDeleted(toolId).orElseThrow(
                () -> new IllegalArgumentException("Tool with id: " + toolId + " not found"));
        return tool.getStockQuantity();
    }

    public List<CBFResponse> getCBFResponseList() {
        return toolRepository.findCBFResponseData();
    }

    // public void updateAvgRating(long toolId, Integer rating) throws
    // IdInvalidException {
    // Tool dbTool = getToolById(toolId);
    // dbTool.setAverageRating(
    // (dbTool.getAverageRating() * dbTool.getTotalRating() + rating) /
    // (dbTool.getTotalRating() + 1)
    // );
    // dbTool.setTotalRating(dbTool.getTotalRating() + 1);
    // }
}