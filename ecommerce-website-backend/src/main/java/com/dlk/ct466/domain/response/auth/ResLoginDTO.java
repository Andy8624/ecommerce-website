package com.dlk.ct466.domain.response.auth;

import com.dlk.ct466.domain.entity.Permission;
import com.dlk.ct466.domain.entity.Role;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResLoginDTO {
    @JsonProperty("access_token")
    String accessToken;
    UserLogin user;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class UserLogin {
        String id;
        String email;
        String fullName;
        RoleInUserLogin role;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class RoleInUserLogin {
        long id;
        String name;
        List<Permission> permissions;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class UserGetAccount {
        UserLogin user;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class UserInsideToken {
        String id;
        String email;
        String fullName;
    }

}
