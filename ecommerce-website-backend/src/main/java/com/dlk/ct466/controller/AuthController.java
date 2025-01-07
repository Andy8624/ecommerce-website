package com.dlk.ct466.controller;

import com.dlk.ct466.domain.entity.User;
import com.dlk.ct466.domain.request.auth.ReqLoginDTO;
import com.dlk.ct466.domain.response.auth.ResAuthDTO;
import com.dlk.ct466.domain.response.auth.ResLoginDTO;
import com.dlk.ct466.domain.response.user.ResCreateUserDTO;
import com.dlk.ct466.service.AuthService;
import com.dlk.ct466.util.annotation.ApiMessage;
import com.dlk.ct466.util.error.IdInvalidException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService authService;

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
    public ResponseEntity<ResLoginDTO> logout() throws IdInvalidException {
        ResAuthDTO resAuthDTO = authService.logout();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, resAuthDTO.getResponseCookie().toString())
                .body(resAuthDTO.getResLoginDTO());
    }

    @PostMapping("/register")
    @ApiMessage("Register a new user")
    public ResponseEntity<ResCreateUserDTO> register(@Valid @RequestBody User user) throws IdInvalidException {
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
            @CookieValue(name = "refresh_token", defaultValue = "khangdeptrai") String refresh_token
    ) throws IdInvalidException {
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

}
