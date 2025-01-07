package com.dlk.ct466.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "courses")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Course extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String courseId;

    String courseUrl;

    @Column(nullable = false)
    @NotNull(message = "Course price could not be null")
    @DecimalMin(value = "0.0", message = "Price must be greater equal than 0")
    BigDecimal price;

    @DecimalMin(value = "0.0", message = "Discounted price must be greater equal than 0")
    BigDecimal discountedPrice;

    @Column(nullable = false)
    boolean deleted = false;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @OneToMany(mappedBy = "course", fetch = FetchType.LAZY)
    @JsonIgnore
    List<OrderCourse> orderCourses;
}