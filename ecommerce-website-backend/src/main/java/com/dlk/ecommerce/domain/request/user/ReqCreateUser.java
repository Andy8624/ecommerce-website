package com.dlk.ecommerce.domain.request.user;

import com.dlk.ecommerce.domain.entity.*;
import com.dlk.ecommerce.util.constant.Gender;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ReqCreateUser {
    @NotBlank(message = "Full name could not be blank")
    String fullName;

    @NotBlank(message = "Email could not be blank")
    @Email(message = "Email should be valid")
    String email;

    @NotBlank(message = "Password could not be blank")
    String password;

    String imageUrl;

    @ManyToOne
    @JoinColumn(name = "role_id")
    Role role;
}
