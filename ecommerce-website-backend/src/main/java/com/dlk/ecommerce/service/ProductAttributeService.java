package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.ProductAttributes;
import com.dlk.ecommerce.domain.entity.Tool;
import com.dlk.ecommerce.domain.request.product_attributes.ProductAttributesRequest;
import com.dlk.ecommerce.repository.ProductAttributeRepository;
import com.dlk.ecommerce.repository.ToolRepository;
import com.dlk.ecommerce.util.error.IdInvalidException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductAttributeService {
    private final ProductAttributeRepository productAttributeRepository;
    private final ToolRepository toolRepository;

    public List<ProductAttributes> getAllAttributes() {
        return productAttributeRepository.findAll();
    }

    public ProductAttributes getAttributeById(String id) throws IdInvalidException {
        return productAttributeRepository.findById(id).orElseThrow(
                () -> new IdInvalidException("Attribute with id: '" + id + "' not found")
        );
    }

    public List<ProductAttributes> getAttributeByToolId(Long toolId) {
        return productAttributeRepository.findByTool_ToolId(toolId);
    }

    public ProductAttributes createAttribute(ProductAttributes attribute) {
        return productAttributeRepository.save(attribute);
    }

    public List<ProductAttributes> addAttributes(ProductAttributesRequest request) throws IdInvalidException {
        // Lấy Tool từ DB
        Tool tool = toolRepository.findByIdIfNotDeleted(request.getToolId())
                .orElseThrow(() -> new IdInvalidException("Sản phẩm không tồn tại"));

        // Chuyển Map<String, String> thành danh sách ProductAttributes
        List<ProductAttributes> attributes = request.getAttributes().entrySet().stream()
                .map(entry -> ProductAttributes.builder()
                        .name(entry.getKey())      // Key là tên thuộc tính
                        .value(entry.getValue())   // Value là giá trị thuộc tính
                        .tool(tool)
                        .build())
                .toList();

        // Lưu tất cả vào database cùng lúc
        return productAttributeRepository.saveAll(attributes);
    }

    public ProductAttributes updateAttribute(String id, ProductAttributes updatedAttribute) throws IdInvalidException {
        ProductAttributes existingAttribute = getAttributeById(id).toBuilder()
                .name(updatedAttribute.getName())
                .value(updatedAttribute.getValue())
                .build();
        return productAttributeRepository.save(existingAttribute);
    }

    public void deleteAttribute(String id) throws IdInvalidException {
        ProductAttributes existingAttribute = getAttributeById(id);
        productAttributeRepository.delete(existingAttribute);
    }
}
