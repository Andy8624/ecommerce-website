package com.dlk.ecommerce.controller;

import com.dlk.ecommerce.domain.entity.User;
import com.dlk.ecommerce.domain.request.auth.LogoutRequest;
import com.dlk.ecommerce.domain.request.auth.ReqLoginDTO;
import com.dlk.ecommerce.domain.request.user.ReqCreateUser;
import com.dlk.ecommerce.domain.response.auth.ResAuthDTO;
import com.dlk.ecommerce.domain.response.auth.ResLoginDTO;
import com.dlk.ecommerce.domain.response.user.ResCreateUserDTO;
import com.dlk.ecommerce.service.AuthRedisService;
import com.dlk.ecommerce.service.AuthService;
import com.dlk.ecommerce.service.BaseRedisService;
import com.dlk.ecommerce.util.annotation.ApiMessage;
import com.dlk.ecommerce.util.error.IdInvalidException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
@Slf4j
public class AuthController {
    private final AuthService authService;
    private final AuthRedisService authRedisService;

    @PostMapping("/login")
    @ApiMessage("Login")
    public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody ReqLoginDTO loginDTO) {
        ResAuthDTO resAuthDTO = authService.login(loginDTO);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, resAuthDTO.getResponseCookie().toString())
                .body(resAuthDTO.getResLoginDTO());
    }

    @PostMapping("/logout")
    @ApiMessage("Logout")
    public ResponseEntity<ResLoginDTO> logout(@RequestBody LogoutRequest request) throws IdInvalidException {
        ResAuthDTO resAuthDTO = authService.logout(request.getOld_access_token(), request.getDevice_id());
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, resAuthDTO.getResponseCookie().toString())
                .body(resAuthDTO.getResLoginDTO());
    }

    @PostMapping("/register")
    @ApiMessage("Register a new user")
    public ResponseEntity<ResCreateUserDTO> register(@Valid @RequestBody ReqCreateUser user) throws IdInvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(user));
    }

    @GetMapping("/account")
    @ApiMessage("Get account")
    public ResponseEntity<ResLoginDTO.UserGetAccount> getAccount() throws IdInvalidException {
        return ResponseEntity.ok().body(authService.getAccount());
    }

    @GetMapping("/refresh")
    @ApiMessage("Refresh token")
    public ResponseEntity<ResLoginDTO> refreshToken(
            @CookieValue(name = "refresh_token", defaultValue = "khangdeptrai") String refresh_token)
            throws IdInvalidException {
        // log.info("refresh_token: " + refresh_token);
        ResAuthDTO resAuthDTO = authService.generateNewTokens(refresh_token);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, resAuthDTO.getResponseCookie().toString())
                .body(resAuthDTO.getResLoginDTO());
    }

    @GetMapping("/check-email/{email}")
    @ApiMessage("Check email")
    public ResponseEntity<Boolean> checkEmail(@PathVariable String email) {
        return ResponseEntity.ok(authService.checkEmail(email));
    }

    @GetMapping("/login-history/{userId}/{limit}")
    @ApiMessage("Get login history")
    public ResponseEntity<?> getLoginHistory(@PathVariable String userId, @PathVariable int limit) {
        return ResponseEntity.ok(authRedisService.getRecentLogins(userId, limit));
    }

    @PostMapping("/reset-password")
    @ApiMessage("Reset password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            authService.sendResetPasswordOTP(email);
            return ResponseEntity.ok("Reset password email sent");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error sending reset password email: " + e.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    @ApiMessage("Verify OTP")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String otp = request.get("otp");
            if (email == null || otp == null) {
                return ResponseEntity.badRequest().body("Email and OTP are required");
            }
            boolean isValid = authService.validatePasswordResetOTP(email, otp);
            return ResponseEntity.ok(isValid);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error verifying OTP: " + e.getMessage());
        }
    }

    @PostMapping("/update-password")
    @ApiMessage("Update password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String newPassword = request.get("newPassword");
            log.info("Email reset {}", email);
            log.info("New password reset {}", newPassword);
            if (email == null || newPassword == null) {
                return ResponseEntity.badRequest().body("Email and new password are required");
            }
            authService.updatePassword(email, newPassword);
            return ResponseEntity.ok("Password updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating password: " + e.getMessage());
        }
    }
}
