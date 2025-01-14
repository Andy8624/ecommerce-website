package com.dlk.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

//disable security
//@SpringBootApplication(exclude = {
//		org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class,
//		org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration.class
//})
@SpringBootApplication(scanBasePackages = "com.dlk.ecommerce")
@EnableJpaRepositories("com.dlk.ecommerce.repository")
@EntityScan("com.dlk.ecommerce.domain")
@EnableJpaAuditing(auditorAwareRef = "auditAwareImpl")
//@SpringBootApplication
public class EcommerceApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcommerceApplication.class, args);
	}

}
