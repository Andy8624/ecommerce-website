package com.dlk.ct466.domain.response.file;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.core.io.Resource;

@Data
@AllArgsConstructor
public class ResDownloadFile {
    private Resource resource;
    private long fileLength;
}
