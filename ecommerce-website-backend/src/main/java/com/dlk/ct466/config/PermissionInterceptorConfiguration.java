package com.dlk.ct466.config;

import com.dlk.ct466.domain.entity.Order;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class PermissionInterceptorConfiguration implements WebMvcConfigurer {
    @Bean
    PermissionInterceptor getPermissionInterceptor() {
        return new PermissionInterceptor();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        String[] whiteList = {
                "/", "/api/v1/auth/**",
                "/api/v1/tools/**",
                "/api/v1/courses/**",
                "/api/v1/ordercourses/**",
                "/api/v1/carts/**",
                "/api/v1/cart-tools/**",
                "/api/v1/files/**",
                "/api/v1/addresses/**",
                "/api/v1/paymentmethods/**",
                "/api/v1/orders/**",
                "/api/v1/ordertools/**",
                "/api/v1/cart-courses/**",
        };
        registry.addInterceptor(getPermissionInterceptor())
                .excludePathPatterns(whiteList)
                .order(Ordered.HIGHEST_PRECEDENCE);
    }

}
