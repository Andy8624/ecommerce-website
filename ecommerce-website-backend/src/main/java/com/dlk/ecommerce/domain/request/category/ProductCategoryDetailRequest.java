package com.dlk.ecommerce.domain.request.category;

import com.dlk.ecommerce.domain.entity.CategoryDetail;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductCategoryDetailRequest {
    List<CategoryRequest> category;
    List<CategoryDetailRequest> categoryDetail;
}
