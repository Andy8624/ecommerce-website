package com.dlk.ct466.domain.response.user;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ResUpdateUserDTO {
    String userId;
    String fullName;
    boolean isActive = true;
    String imageUrl;
    Instant updatedAt;
    String updatedBy;
}
