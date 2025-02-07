package com.dlk.ecommerce.domain.entity;

import com.dlk.ecommerce.util.constant.Gender;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

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
    @JsonIgnore
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

    @Column(unique = true)
    String shopId = null;

    // Địa chỉ nhận hàng (địa chỉ cửa hàng)
    String shopAddressId = null;

    String businessType = null;
    // Địa chỉ đăng ký kinh doanh
    String businessAddress = null;
    String billingEmail = null;
    String taxNumber = null;

    @Column(unique = true)
    String shopName = null;

    @Column(columnDefinition = "json")
    String shippingMethod;

    // Chuyển từ JSON String thành Object (Map)
    public Map<String, Object> getShippingMethodAsMap() {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(this.shippingMethod, new TypeReference<Map<String, Object>>() {});
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    // Chuyển Object thành JSON String
    public void setShippingMethodFromMap(Map<String, Object> shippingMethod) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            this.shippingMethod = objectMapper.writeValueAsString(shippingMethod);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Enumerated(EnumType.STRING)
    Gender gender;

    @Column(columnDefinition = "MEDIUMTEXT")
    @JsonIgnore
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
