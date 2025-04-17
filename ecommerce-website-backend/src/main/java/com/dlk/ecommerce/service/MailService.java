package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.request.mail.MailDTO;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import java.nio.charset.StandardCharsets;

@Service
@Slf4j
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSender javaMailSender;
    private final SpringTemplateEngine templateEngine;

    @KafkaListener(id = "mailNotification", topics = "reset-password")
    public void listen(MailDTO mailDTO) {
        log.info("Received message: {}", mailDTO.getTo());
        sendEmail(mailDTO);
    }

    @Async
    public void sendEmail(MailDTO messageDTO) {
        try {
            log.info("Sending email to: {}", messageDTO.getTo());
            // Send email
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, StandardCharsets.UTF_8.name());

            // Load template email with context
            Context context = new Context();
            context.setVariable("name", messageDTO.getToName());
            context.setVariable("content", messageDTO.getContent());
            String html = templateEngine.process("reset-password", context);

            // Send email
            helper.setTo(messageDTO.getTo());
            helper.setText(html, true);
            helper.setSubject(messageDTO.getSubject());
            helper.setFrom("duonglapkhang283@gmail.com");
            javaMailSender.send(message);

            log.info("End sending email to: {}", messageDTO.getTo());

        } catch (Exception e) {
            log.error("Failed to send email to: {}", messageDTO.getTo());
        }
    }
}
