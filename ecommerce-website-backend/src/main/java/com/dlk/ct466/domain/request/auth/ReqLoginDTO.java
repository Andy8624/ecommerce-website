package com.dlk.ct466.domain.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReqLoginDTO {
    @NotBlank(message = "Email could not be blank")
    @Email(message = "Email should be valid")
    String email;

    @NotBlank(message = "Password could not be blank")
    String password;
}
