package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.Tool;
import com.dlk.ecommerce.domain.entity.ToolType;
import com.dlk.ecommerce.domain.entity.User;
import com.dlk.ecommerce.domain.mapper.ToolMapper;
import com.dlk.ecommerce.domain.request.product_attributes.ProductAttributesRequest;
import com.dlk.ecommerce.domain.request.tool.ReqToolDTO;
import com.dlk.ecommerce.domain.response.ResPaginationDTO;
import com.dlk.ecommerce.domain.response.tool.ResCreateToolDTO;
import com.dlk.ecommerce.domain.response.tool.ResToolDTO;
import com.dlk.ecommerce.domain.response.tool.ResUpdateToolDTO;
import com.dlk.ecommerce.repository.ToolRepository;
import com.dlk.ecommerce.util.PaginationUtil;
import com.dlk.ecommerce.util.error.IdInvalidException;
import com.turkraft.springfilter.converter.FilterSpecification;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;
import com.turkraft.springfilter.parser.FilterParser;
import com.turkraft.springfilter.parser.node.FilterNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

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

    public Tool getToolById(long toolId) throws IdInvalidException {
        return toolRepository.findByIdIfNotDeleted(toolId).orElseThrow(
                () -> new IdInvalidException("Tool with id: " + toolId + " not found")
        );
    }

    public ResToolDTO getToolByIdDTO(long toolId) throws IdInvalidException {
        Tool tool = toolRepository.findByIdIfNotDeleted(toolId).orElseThrow(
                () -> new IdInvalidException("Tool with id: " + toolId + " not found")
        );
        return toolMapper.mapToResToolDTO(tool);
    }

    public ResCreateToolDTO createTool(ReqToolDTO request) throws IdInvalidException {
        User dbUser = userService.fetchUserById(request.getUser().getUserId());
        ToolType dbToolType = toolTypeService.getToolTypeById(request.getToolType().getToolTypeId());
        log.info("Create Tool Request: {}", request);
        log.info("attributes: {}", request.getAttributes());

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
                .discountedPrice(request.getDiscountedPrice())
                .isActive(true)
                .build();
        Tool newTool = toolRepository.save(tool);
        ProductAttributesRequest attrRequest = new ProductAttributesRequest(
                newTool.getToolId(),
                request.getAttributes()
        );

        productAttributeService.addAttributes(attrRequest);
        return toolMapper.mapToResCreateToolDTO(newTool);
    }

    public ResUpdateToolDTO updateTool(ReqToolDTO request, long id) throws IdInvalidException {
        User dbUser = userService.fetchUserById(request.getUser().getUserId());

        ToolType dbToolType = toolTypeService.getToolTypeById(request.getToolType().getToolTypeId());

        Tool dbTool = getToolById(id);

        Tool tool = dbTool.toBuilder()
                .user(dbUser)
                .toolType(dbToolType)
                .name(request.getName())
                .description(request.getDescription())
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .price(request.getPrice())
                .discountedPrice(request.getDiscountedPrice())
                .isActive(request.isActive())
                .build();
        Tool updatedTool = toolRepository.save(tool);
        return toolMapper.mapToResUpdateToolDTO(updatedTool);
    }

    public Void deleteTool(Long toolId) throws IdInvalidException {
        Tool dbTool = getToolById(toolId);
        toolRepository.delete(dbTool); // đây là xóa mềm do đã thiết lập SQL ở model
        return null;
    }

    public Void restoreTool(Long toolId) throws IdInvalidException {
        Tool dbTool = toolRepository.getToolDeletedById(toolId).orElseThrow(
                () -> new IdInvalidException("Tool with id: " + toolId + " not found or haven't deleted yet")
        );
        dbTool.setDeleted(false);
        toolRepository.save(dbTool);
        return null;
    }

    public ResPaginationDTO getAllTool(Pageable pageable) {
        FilterNode node = filterParser.parse("deleted=false");
        FilterSpecification<Tool> spec = filterSpecificationConverter.convert(node);

        Page<Tool> pageTools = toolRepository.findAll(spec, pageable);
        return PaginationUtil.getPaginatedResult(pageTools, pageable, toolMapper::mapToResToolDTO);
    }

    public ResPaginationDTO getAllToolAdmin(Pageable pageable) {
        Page<Tool> pageTools = toolRepository.findAll(pageable);
        return PaginationUtil.getPaginatedResult(pageTools, pageable, toolMapper::mapToResToolDTO);
    }

    public ResPaginationDTO getToolByUserId(Pageable pageable, String id) throws IdInvalidException {
        userService.fetchUserById(id);
        FilterNode node = filterParser.parse("deleted=false and user.id='" + id + "'");
        FilterSpecification<Tool> spec = filterSpecificationConverter.convert(node);

        Page<Tool> pageTools = toolRepository.findAll(spec, pageable);
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
}
