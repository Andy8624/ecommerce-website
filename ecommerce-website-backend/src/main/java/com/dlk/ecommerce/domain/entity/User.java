package com.dlk.ecommerce.domain.entity;

import com.dlk.ecommerce.util.constant.Gender;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String userId;

    @NotBlank(message = "Full name could not be blank")
    String fullName;

    @NotBlank(message = "Email could not be blank")
    @Email(message = "Email should be valid")
    String email;

    @NotBlank(message = "Password could not be blank")
    String password;

    String imageUrl;

    @Column(nullable = false)
    boolean deleted = false;

    @Column(nullable = false)
    boolean isActive = true;

    @Pattern(
            regexp = "^\\+?[0-9]{7,15}$",
            message = "Phone number must be valid and contain 7 to 15 digits"
    )
    String phone = null;

    LocalDate birthdate = null;

    @Enumerated(EnumType.STRING)
    Gender gender;

    @Column(columnDefinition = "MEDIUMTEXT")
    String refreshToken;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    List<Address> address;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    List<Order> orders;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    List<Tool> tools;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    List<Course> courses;

    @ManyToOne
    @JoinColumn(name = "role_id")
    Role role;

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    Cart cart;
}
