package com.dlk.ct466.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Table(name = "tool_types")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ToolType extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long toolTypeId;

    @Column(nullable = false)
    @NotBlank(message = "Tool type name could not be blank")
    String name;

    @OneToMany(mappedBy = "toolType", fetch = FetchType.LAZY)
    @JsonIgnore
    List<Tool> tools;

    @Column(nullable = false)
    boolean deleted = false;
}
