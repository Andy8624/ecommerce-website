package com.dlk.ecommerce.domain.response.toolType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ToolTypeDTO {
    long toolTypeId;
    String name;
}
