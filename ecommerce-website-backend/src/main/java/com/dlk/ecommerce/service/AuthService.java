package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.Permission;
import com.dlk.ecommerce.domain.entity.User;
import com.dlk.ecommerce.domain.request.auth.ReqLoginDTO;
import com.dlk.ecommerce.domain.request.user.ReqCreateUser;
import com.dlk.ecommerce.domain.response.ResPaginationDTO;
import com.dlk.ecommerce.domain.response.auth.ResAuthDTO;
import com.dlk.ecommerce.domain.response.auth.ResLoginDTO;
import com.dlk.ecommerce.domain.response.user.ResCreateUserDTO;
import com.dlk.ecommerce.util.SecurityUtil;
import com.dlk.ecommerce.util.error.IdInvalidException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final UserService userService;
    private final SecurityUtil securityUtil;
    private final RolePermissionService rolePermissionService;
    private final AuthRedisService authRedisService;
    private final BaseRedisService redisService; // dòng này thêm tạm

    @Value("${dlk.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    @Value("${dlk.jwt.access-token-validity-in-seconds}")
    private long accessTokenExpiration;

    public ResAuthDTO login(ReqLoginDTO loginDTO) {
        // Nạp email và password vào Security
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword());

        // Xác thực người dùng, hàm này sẽ gọi đến hàm loadUserByUsername
        Authentication authentication = authenticationManagerBuilder.getObject()
                .authenticate(authenticationToken);

        // Lưu thông tin đăng nhập vào Security Context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        ResLoginDTO res = new ResLoginDTO();

        User dbUser = userService.findUserByEmail(loginDTO.getEmail());
        if (dbUser != null) {
            Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE);
            ResPaginationDTO paginationDTO = rolePermissionService.getPermissionsByRoleIdDTO(dbUser.getRole().getRoleId(), pageable);
            List<Permission> permissions = (List<Permission>) paginationDTO.getResult();
            ResLoginDTO.RoleInUserLogin roleInUserLogin = new ResLoginDTO.RoleInUserLogin(
                    dbUser.getRole().getRoleId(),
                    dbUser.getRole().getName(),
                    permissions
            );
            ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin(
                    dbUser.getUserId(),
                    dbUser.getEmail(),
                    dbUser.getFullName(),
                    dbUser.getBirthdate(),
                    dbUser.getCart().getCartId(),
                    dbUser.getImageUrl(),
                    dbUser.getPhone(),
                    dbUser.getGender(),
                    roleInUserLogin
            );
            res.setUser(userLogin);
        }

        // create access token
        String access_token = securityUtil.createAccessToken(authentication.getName(), res);
        res.setAccessToken(access_token);

        // create refresh token
        String refresh_token = securityUtil.createRefreshToken(loginDTO.getEmail(), res);
        userService.updateUserToken(refresh_token, loginDTO.getEmail());

        // set cookies
        ResponseCookie responseCookie = ResponseCookie
                .from("refresh_token", refresh_token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshTokenExpiration)
                .build();

        return new ResAuthDTO(res, responseCookie);
    }

    public ResLoginDTO.UserGetAccount getAccount() throws IdInvalidException {
        String email = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new IdInvalidException("Access token not valid"));

        User dbUser = userService.findUserByEmail(email);
        ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin();
        ResLoginDTO.UserGetAccount userGetAccount = new ResLoginDTO.UserGetAccount();
        if (dbUser != null) {
            Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE);
            ResPaginationDTO paginationDTO = rolePermissionService.getPermissionsByRoleIdDTO(dbUser.getRole().getRoleId(), pageable);
            List<Permission> permissions = (List<Permission>) paginationDTO.getResult();
            ResLoginDTO.RoleInUserLogin roleInUserLogin = new ResLoginDTO.RoleInUserLogin(
                    dbUser.getRole().getRoleId(),
                    dbUser.getRole().getName(),
                    permissions
            );

            userLogin.setId(dbUser.getUserId());
            userLogin.setEmail(dbUser.getEmail());
            userLogin.setFullName(dbUser.getFullName());
            userLogin.setBirthdate(dbUser.getBirthdate());
            userLogin.setCartId(dbUser.getCart().getCartId());
            userLogin.setImageUrl(dbUser.getImageUrl());
            userLogin.setPhone(dbUser.getPhone());
            userLogin.setGender(dbUser.getGender());
            userLogin.setRole(roleInUserLogin);
            userGetAccount.setUser(userLogin);
        }

        return userGetAccount;
    }

    public ResAuthDTO generateNewTokens(String refresh_token) throws IdInvalidException {
        if (refresh_token.equals("khangdeptrai")) {
            throw new IdInvalidException("Resfresh token doesn't exist in cookie");
        }

        // check valid refresh_token
        Jwt decodedToken = securityUtil.checkValidRefreshToken(refresh_token);
        String email = decodedToken.getSubject();

        // tìm user dựa trên refresh_token và email
        User dbUser = userService.getUserByRefreshTokenAndEmail(refresh_token, email).orElseThrow(
                () -> new IdInvalidException("Refresh token not valid")
        );

        ResLoginDTO res = new ResLoginDTO();
        Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE);
        ResPaginationDTO paginationDTO = rolePermissionService.getPermissionsByRoleIdDTO(dbUser.getRole().getRoleId(), pageable);
        List<Permission> permissions = (List<Permission>) paginationDTO.getResult();
        ResLoginDTO.RoleInUserLogin roleInUserLogin = new ResLoginDTO.RoleInUserLogin(
                dbUser.getRole().getRoleId(),
                dbUser.getRole().getName(),
                permissions
        );
        ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin(
                dbUser.getUserId(),
                dbUser.getEmail(),
                dbUser.getFullName(),
                dbUser.getBirthdate(),
                dbUser.getCart().getCartId(),
                dbUser.getImageUrl(),
                dbUser.getPhone(),
                dbUser.getGender(),
                roleInUserLogin
        );
        res.setUser(userLogin);

        // tạo access token mới
        String newAccessToken = securityUtil.createAccessToken(email, res);
        res.setAccessToken(newAccessToken);

        // tạo refresh token mới
        String newRefreshToken = securityUtil.createRefreshToken(email, res);
        userService.updateUserToken(newRefreshToken, email);

        // set cookies
        ResponseCookie responseCookie = ResponseCookie
                .from("refresh_token", newRefreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshTokenExpiration)
                .build();

        return new ResAuthDTO(res, responseCookie);
    }

    public ResAuthDTO logout(String old_access_token) throws IdInvalidException {
        String email = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new IdInvalidException("Access token not valid"));
//        log.info("Logout success: " + email);
        log.info("Old access token: " + old_access_token);
        userService.updateUserToken(null, email);

        // Đưa access token vào blacklist trong Redis
        authRedisService.addToBlacklist(old_access_token, accessTokenExpiration);
        log.info("Blacklist access token redis: " + redisService.get("auth:token:" + old_access_token));
        log.info("TTL redis: " + redisService.getTimeToLive("auth:token:" + old_access_token));

        ResponseCookie deleteSpringCookie = ResponseCookie
                .from("refresh_token", null)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();
        return new ResAuthDTO(null, deleteSpringCookie);
    }

    public ResCreateUserDTO register(ReqCreateUser user) throws IdInvalidException {
        return userService.createUser(user);
    }

    public Boolean checkEmail(String email) {
        User userDb = userService.findUserByEmail(email);
        return userDb != null;
    }
}



























