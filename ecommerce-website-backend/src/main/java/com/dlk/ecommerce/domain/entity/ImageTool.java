package com.dlk.ecommerce.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "image_tools")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ImageTool {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long imageId;

    @Column(nullable = false)
    String fileName;

    @Lob
    @Column(columnDefinition = "LONGBLOB") // Lưu vector dưới dạng BLOB (nhị phân)
    byte[] featureVector;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tool_id", nullable = false)
    @JsonIgnore
    Tool tool;
}
