package com.dlk.ecommerce.config;

import com.dlk.ecommerce.service.AuthRedisService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.util.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

@Configuration
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfiguration {
    private static final String[] PUBLIC_ENDPOINTS = {
            "/",
            "/api/v1/auth/register",
            "/api/v1/auth/login",
            "/api/v1/auth/account",
            "/api/v1/auth/refresh",
            "/api/v1/auth/reset-password",
            "/api/v1/auth/check-email/**",
            "/api/v1/tools/**",
            "/api/v1/carts/**",
            "/api/v1/cart-tools/**",
            "/resources/**",
            "/api/v1/files/**",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/api/v1/recommendation/**",
            "/ws/**",
            "/api/v1/messages/**",
            "/api/v1/image-tools/**",
            "/api/v1/ghn/**",
            "/api/v1/addresses/**",
            "/api/v1/ordertools/total-sold/**",
            "/api/v1/categories/**",
            "/api/v1/variant-detail/**",
            "/api/v1/product-reviews/**",
            "/api/v1/messages/**",
            "/api/v1/kafka/**",
            "/api/v1/product-reviews/**",
            "/api/v1/tooltypes/**",
            "/api/v1/tooltypes?**",
            "/api/v1/orders/**",
            "/api/v1/variant-detail/**",
            "/api/user-interaction/**",
            "/api/v1/users/**",
            "/api/v1/recommendation/cf-data/**",
            "/api/v1/auth/**"
    };

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            CustomAuthenticationEntryPoint customAuthenticationEntryPoint,
            AuthRedisService authRedisService,
            ObjectMapper objectMapper,
            CorsConfigurationSource corsConfigurationSource
            ) throws Exception {
        http
                .csrf(c -> c.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(Customizer.withDefaults())
                        .authenticationEntryPoint(customAuthenticationEntryPoint)
                )
                .formLogin(form -> form.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(
                        new JwtBlacklistFilter(authRedisService, objectMapper),
                        BearerTokenAuthenticationFilter.class
                );

        return http.build();
    }

    @Value("${dlk.jwt.base64-secret}")
    private String jwtKey;

    // Dùng thuật toán HMAC-SHA512 (HS512)
    public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS512;

    // Tạo secretKey từ jwtKey
    public SecretKey getSecretKey() {
        byte[] keyBytes = Base64.from(jwtKey).decode();
        return new SecretKeySpec(
                keyBytes,
                0,
                keyBytes.length,
                JWT_ALGORITHM.getName()
        );
    }

    @Bean  // Mã hóa JWT
    public JwtEncoder jwtEncoder() {
        return new NimbusJwtEncoder(new ImmutableSecret<>(getSecretKey()));
    }

    @Bean  // Giải mã JWT
    public JwtDecoder jwtDecoder() {
        // lấy ra chìa khóa để thực hiện giải mã (gồm secretKey và thuật toán)
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder
                .withSecretKey(getSecretKey())
                .macAlgorithm(JWT_ALGORITHM)
                .build();

        return (token) -> {
            try {
                return jwtDecoder.decode(token);  // Giải mã JWT Token
            } catch (Exception e) {
                System.out.println(">>> JWT Error: " + e.getMessage());
                throw e;
            }
        };
    }

    @Bean  // Sử dụng BCrypt để hash mật khẩu
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();  // Sử dụng BCrypt để băm (hash) mật khẩu.
    }
}
