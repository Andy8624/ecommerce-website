package com.dlk.ecommerce.domain.request.mail;

import lombok.Data;

@Data
public class MailDTO {
    private String to;
    private String toName;
    private String subject;
    private String content;
}
