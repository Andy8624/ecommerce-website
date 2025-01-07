package com.dlk.ct466.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Table(name = "addresses")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Address extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String addressId;

    // Đường
    @NotBlank(message = "Street could not be blank")
    String street;

    // Phường xã
    @NotBlank(message = "Ward could not be blank")
    String ward;

    // Quận huyện
    @NotBlank(message = "District could not be blank")
    String district;

    // Tỉnh thành phố
    @NotBlank(message = "City could not be blank")
    String city;

    @Column(nullable = false)
    boolean deleted = false;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @OneToMany(mappedBy = "address", fetch = FetchType.LAZY)
    @JsonIgnore
    List<Order> orders;
}
