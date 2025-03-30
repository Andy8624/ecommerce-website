package com.dlk.ecommerce.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product_variants")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    BigDecimal price;
    Integer stock;

    @ManyToOne
    @JoinColumn(name = "tool_id")
    @JsonIgnore
    Tool tool;

    @OneToMany(mappedBy = "productVariant", cascade = CascadeType.ALL)
    @JsonIgnore
    List<VariantDetail> variantDetails = new ArrayList<>();
}
