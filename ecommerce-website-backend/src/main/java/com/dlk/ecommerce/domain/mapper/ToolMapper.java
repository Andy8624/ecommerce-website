package com.dlk.ecommerce.domain.mapper;

import com.dlk.ecommerce.domain.entity.*;
import com.dlk.ecommerce.domain.response.tool.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ToolMapper {

    // ✅ Mapping từ Tool sang ResToolDTO
    @Mapping(source = "active", target = "isActive")
    @Mapping(source = "variants", target = "variants") // Thêm danh sách biến thể
    ResToolDTO mapToResToolDTO(Tool tool);

    ResCreateToolDTO mapToResCreateToolDTO(Tool tool);
    ResUpdateToolDTO mapToResUpdateToolDTO(Tool tool);

    // ✅ Mapping thông tin chủ sở hữu sản phẩm
    @Mapping(source = "userId", target = "userId")
    @Mapping(source = "email", target = "email")
    @Mapping(source = "fullName", target = "fullName")
    @Mapping(source = "address", target = "address")
    ResToolDTO.ToolOwner mapToolOwner(User user);

    // ✅ Mapping loại sản phẩm
    @Mapping(source = "toolTypeId", target = "toolTypeId")
    @Mapping(source = "name", target = "name")
    ResToolDTO.TypeOfTool mapTypeOfTool(ToolType toolType);

    // ✅ Mapping địa chỉ
    @Mapping(source = "city", target = "city")
    @Mapping(source = "district", target = "district")
    @Mapping(source = "ward", target = "ward")
    @Mapping(source = "street", target = "street")
    ResToolDTO.ToolOwner.Address mapAddress(Address address);

    // ✅ Mapping từ ProductVariant sang DTO
    @Mapping(source = "id", target = "variantId")
    @Mapping(source = "price", target = "price")
    @Mapping(source = "stock", target = "stockQuantity")
    @Mapping(source = "variantDetails", target = "attributes")
    ResToolDTO.ProductVariantDTO mapToProductVariantDTO(ProductVariant productVariant);

    // ✅ Mapping từ VariantDetail sang DTO
    @Mapping(source = "id", target = "variantDetailId")
    @Mapping(source = "categoryDetail.id", target = "categoryDetailId")
    @Mapping(source = "categoryDetail.name", target = "attributeValue")
    @Mapping(source = "categoryDetail.category.name", target = "categoryName")
    ResToolDTO.VariantDetailDTO mapToVariantDetailDTO(VariantDetail variantDetail);

    List<ResToolDTO.ProductVariantDTO> mapToProductVariantDTOList(List<ProductVariant> productVariants);
    List<ResToolDTO.VariantDetailDTO> mapToVariantDetailDTOList(List<VariantDetail> variantDetails);
}
