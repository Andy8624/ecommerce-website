package com.dlk.ct466.util;


import com.dlk.ct466.domain.response.ResPaginationDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.function.Function;
import java.util.stream.Collectors;

public class PaginationUtil {
    public static <T> ResPaginationDTO getPaginatedResult(Page<T> pageEntity, Pageable pageable) {
        // Gọi phương thức getPaginatedResult với converter là null
        return getPaginatedResult(pageEntity, pageable, null);
    }

    public static <T, DTO> ResPaginationDTO getPaginatedResult(
            Page<T> pageEntity,
            Pageable pageable,
            Function<T, DTO> converter
    ) {
        ResPaginationDTO.Meta meta = new ResPaginationDTO.Meta();
        meta.setPage(pageable.getPageNumber() + 1); // Trang hiện tại (bắt đầu từ 1)
        meta.setPageSize(pageable.getPageSize()); // Kích thước mỗi trang
        meta.setPages(pageEntity.getTotalPages()); // Tổng số trang
        meta.setTotal(pageEntity.getTotalElements()); // Tổng số phần tử

        ResPaginationDTO res = new ResPaginationDTO();
        res.setMeta(meta);

        // Kiểm tra nếu converter là null, thì không cần chuyển sang DTO
        if (converter == null) {
            res.setResult(pageEntity.getContent()); // Không chuyển đổi
        } else {
            res.setResult(pageEntity.getContent()
                    .stream().map(converter) // Chuyển đổi từ entity thành DTO
                    .collect(Collectors.toList()));
        }

        return res;
    }


}

