package com.dlk.ct466;

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
@SpringBootApplication(scanBasePackages = "com.dlk.ct466")

@EnableJpaRepositories("com.dlk.ct466.repository")
@EntityScan("com.dlk.ct466.domain")
@EnableJpaAuditing(auditorAwareRef = "auditAwareImpl")
//@SpringBootApplication
public class Ct466Application {

	public static void main(String[] args) {
		SpringApplication.run(Ct466Application.class, args);
	}

}
