package com.dlk.ct466.domain.response;

import com.dlk.ct466.util.annotation.ApiMessage;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.MethodParameter;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@RestControllerAdvice
public class FormatRestResponse implements ResponseBodyAdvice<Object> {

    //    Phương thức supports quyết định liệu việc can thiệp (beforeBodyWrite) có được áp dụng hay không
//    cho từng response cụ thể.
//    Trong trường hợp này, bạn đang trả về true, nghĩa là can thiệp sẽ được áp dụng cho tất cả các
//    response từ API.
//    Bạn có thể tùy chỉnh logic để chỉ áp dụng với các kiểu trả về hoặc phương thức cụ thể.
//    Ví dụ: kiểm tra kiểu dữ liệu trả về hoặc có một annotation đặc biệt.
    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        //  Ví dụ: Chỉ áp dụng nếu kiểu trả về là MyCustomType
        //  return returnType.getParameterType().equals(MyCustomType.class);

        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body,
                                  MethodParameter returnType,
                                  MediaType selectedContentType,
                                  Class selectedConverterType,
                                  ServerHttpRequest request,
                                  ServerHttpResponse response) {
        // tạo đối tượng phản hồi
        RestResponse<Object> res = new RestResponse<Object>();

        HttpServletResponse servletResponse = ((ServletServerHttpResponse) response)
                .getServletResponse();
        int status = servletResponse.getStatus();

        res.setStatusCode(status);

        // cho phép trả về API dạng String hoặc Resource (file, ảnh)
        // mà không bắt buộc trả về DTO Object Class
        // Nếu không có dòng này sẽ bị lỗi Code 500 do không thể cast kiểu String sang Object Class
        if (body instanceof String || body instanceof Resource) return body;

        if (status >= 400) {
            return body;
        } else {
            res.setData(body);
            // tìm các controller có annotation là @ApiMessage và lấy chuỗi được chứa
            ApiMessage message = returnType.getMethodAnnotation(ApiMessage.class);
            res.setMessage(message != null ? message.value() : "API call successful");
        }

        return res;
    }
}

