package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.Permission;
import com.dlk.ecommerce.domain.entity.User;
import com.dlk.ecommerce.domain.request.auth.ReqLoginDTO;
import com.dlk.ecommerce.domain.request.mail.MailDTO;
import com.dlk.ecommerce.domain.request.user.ReqCreateUser;
import com.dlk.ecommerce.domain.response.ResPaginationDTO;
import com.dlk.ecommerce.domain.response.auth.ResAuthDTO;
import com.dlk.ecommerce.domain.response.auth.ResLoginDTO;
import com.dlk.ecommerce.domain.response.user.ResCreateUserDTO;
import com.dlk.ecommerce.repository.UserRepository;
import com.dlk.ecommerce.util.SecurityUtil;
import com.dlk.ecommerce.util.error.IdInvalidException;
import com.dlk.ecommerce.util.helper.LogFormatter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseCookie;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final UserService userService;
    private final SecurityUtil securityUtil;
    private final RolePermissionService rolePermissionService;
    private final AuthRedisService authRedisService;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

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

//        log.info("Login DTO {}", loginDTO);
        // Lấy deviceId để làm session đăng nhập
        String sessionId = loginDTO.getDeviceId();
//        log.info("sessionId login: {}", sessionId);
        // Lưu phiên đăng nhập vào Redis
        assert dbUser != null;
        authRedisService.saveLoginSession(dbUser.getUserId(), sessionId, loginDTO.getIp(), loginDTO.getUserAgent());
//        log.info("✅ Saved login session");

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

    public ResAuthDTO logout(String old_access_token, String device_id) throws IdInvalidException {
        String email = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new IdInvalidException("Access token not valid"));

        // Đưa access token vào blacklist trong Redis (Dùng JTI để giảm độ dài của key)
//        log.info("🔴 Check token in blacklist: {}", old_access_token);
        String JTI = securityUtil.getJtiFromToken(old_access_token);
//        log.info("🛑 Add JTI access token to blacklist: {}", JTI);
        authRedisService.addToBlacklist(JTI, accessTokenExpiration);

        // Xóa session đăng nhập trong Redis
        String userId = userService.findUserByEmail(email).getUserId();
//        log.info("Logout session ID: {}", device_id);
        authRedisService.deleteSession(userId, device_id);

        userService.updateUserToken(null, email);

        ResponseCookie deleteSpringCookie = ResponseCookie
                .from("refresh_token", null)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();
        return new ResAuthDTO(null, deleteSpringCookie);
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
        log.info("Email generateNewTokens: {}", email);

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

    public ResCreateUserDTO register(ReqCreateUser user) throws IdInvalidException {
        return userService.createUser(user);
    }

    public Boolean checkEmail(String email) {
        User userDb = userService.findUserByEmail(email);
        return userDb != null;
    }

//    public void resetPassword(String email) {
//        MailDTO dto = new MailDTO();
//        String username = email.substring(0, email.indexOf("@"));
//        dto.setTo(email);
//        dto.setToName(username);
//        dto.setSubject("Welcome to our platform");
//        dto.setContent("Welcome " +  username + " to our platform");
//
//        kafkaTemplate.send("reset-password", dto);
//    }


    public String generateOTP() {
        Random random = new Random();
        // Tạo số ngẫu nhiên từ 1000 đến 9999 (bao gồm cả hai)
        int otp = random.nextInt(9000) + 1000;
        return String.valueOf(otp);
    }

    public void sendResetPasswordOTP(String email) {
        MailDTO dto = new MailDTO();
        String username = email.substring(0, email.indexOf("@"));
        String otp = generateOTP();
        log.info("OTP: {}", otp);
        authRedisService.savePasswordResetOTP(email, otp);

        dto.setTo(email);
        dto.setToName(username);
        dto.setSubject("Mã OTP Đặt Lại Mật Khẩu");
        dto.setContent(otp);

        kafkaTemplate.send("reset-password", dto);
    }

    public boolean validatePasswordResetOTP(String email, String otp) {
        return authRedisService.validatePasswordResetOTP(email, otp);
    }

    public void updatePassword(String email, String newPassword) {
        User user = userService.findUserByEmail(email);
        LogFormatter.logFormattedRequest("User", user);
        if (user != null) {
            log.info("New password {}", newPassword);
            String  hashPassword = passwordEncoder.encode(newPassword);
            user.setPassword(hashPassword);
            userRepository.save(user);
        } else {
            log.error("User not found with email: {}", email);
        }
    }
}



























