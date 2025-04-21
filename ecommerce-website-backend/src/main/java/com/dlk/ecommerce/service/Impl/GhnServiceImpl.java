package com.dlk.ecommerce.service.Impl;


import com.dlk.ecommerce.domain.entity.Address;
import com.dlk.ecommerce.domain.entity.User;
import com.dlk.ecommerce.domain.request.ghn.*;
import com.dlk.ecommerce.domain.request.user.ReqCreateShop;
import com.dlk.ecommerce.repository.AddressRepository;
import com.dlk.ecommerce.repository.UserRepository;
import com.dlk.ecommerce.service.AddressService;
import com.dlk.ecommerce.service.GhnService;
import com.dlk.ecommerce.service.UserService;
import com.dlk.ecommerce.util.GhnApiUtil;
import com.dlk.ecommerce.util.error.IdInvalidException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class GhnServiceImpl implements GhnService {
    private final UserService userService;
    private final GhnApiUtil ghnApiUtil;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final ObjectMapper objectMapper;

    @Override
    public Object getProvinces() {
        return ghnApiUtil.callGhnApi("/master-data/province", HttpMethod.POST, null);
    }

    @Override
    public Object getDistricts(int provinceId) {
        return ghnApiUtil.callGhnApi("/master-data/district", HttpMethod.POST, Map.of("province_id", provinceId));
    }

    @Override
    public Object getWards(int districtId) {
        return ghnApiUtil.callGhnApi("/master-data/ward", HttpMethod.POST, Map.of("district_id", districtId));
    }

    @Override
    public Object calculateShippingCost(CalculateShippingCostRequest request) {
        HttpHeaders headers = ghnApiUtil.createHeaders();
        headers.set("ShopId", userService.getShopId());

        Map<String, Object> data = new HashMap<>();

        // Map các trường từ CalculateShippingCostRequest sang data
        data.put("service_type_id", request.getService_type_id());

        // Chuyển đổi tên tỉnh/quận/phường thành ID và code
        data.put("from_district_id", getDistrictIdByName(
                new GetDistrictIDRequest(request.getFrom_province(), request.getFrom_district()))
        );
        data.put("from_ward_code", getWardIdByName(
                new GetWardIDRequest(request.getFrom_province(), request.getFrom_district(), request.getFrom_ward())
        ).toString());

        data.put("to_district_id", getDistrictIdByName(
                new GetDistrictIDRequest(request.getTo_province(), request.getTo_district()))
        );
        data.put("to_ward_code", getWardIdByName(
                new GetWardIDRequest(request.getTo_province(), request.getTo_district(), request.getTo_ward())
        ).toString());

        data.put("length", request.getLength());
        data.put("width", request.getWidth());
        data.put("height", request.getHeight());
        data.put("weight", request.getWeight());
        data.put("insurance_value", request.getInsurance_value());
        data.put("coupon", null);

        // Map các item
        List<Map<String, Object>> items = new ArrayList<>();
        if (request.getItems() != null) {
            for (OrderItemGHN item : request.getItems()) {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("name", item.getName());
                itemMap.put("quantity", item.getQuantity());
                itemMap.put("length", item.getLength());
                itemMap.put("width", item.getWidth());
                itemMap.put("height", item.getHeight());
                itemMap.put("weight", item.getWeight());
                items.add(itemMap);
            }
        }
        data.put("items", items);

//        log.info("Request: {}", request);
//        log.info("Data for GHN API: {}", data);

        return ghnApiUtil.callGhnApi("/v2/shipping-order/fee", HttpMethod.POST, data);
    }

    @Override
    public Object createShop(Object data) {
        return ghnApiUtil.callGhnApi("/v2/shop/register", HttpMethod.POST, data);
    }

    @Override
    public Object getShops(Object data) {
        return ghnApiUtil.callGhnApi("/v2/shop/all", HttpMethod.GET, data);
    }

    @Override
    public Object createOrder(ReqCreateOrderGHN data) {
        HttpHeaders headers = ghnApiUtil.createHeaders();
        headers.set("ShopId", userService.getShopId());
        return ghnApiUtil.callGhnApi("/v2/shipping-order/create", HttpMethod.POST, data);
    }

    @Override
    public Object cancelOrder(Object data) {
        HttpHeaders headers = ghnApiUtil.createHeaders();
        headers.set("ShopId", userService.getShopId());
        return ghnApiUtil.callGhnApi("/v2/switch-status/cancel", HttpMethod.POST, data);
    }

    @Override
    public Object returnOrder(Object data) {
        HttpHeaders headers = ghnApiUtil.createHeaders();
        headers.set("ShopId", userService.getShopId());
        return ghnApiUtil.callGhnApi("/v2/switch-status/return", HttpMethod.POST, data);
    }

    @Override
    public Object getEstimatedDeliveryTime(DeliveryTimeRequest request) {
        HttpHeaders headers = ghnApiUtil.createHeaders();
        headers.set("ShopId", userService.getShopId());
//        log.info("Request: {}", request);
        Map<String, Object> data = new HashMap<>();
        data.put("from_district_id", getDistrictIdByName(
                new GetDistrictIDRequest(request.getFrom_province(), request.getFrom_district()))
        );
        data.put("from_ward_code", getWardIdByName(
                    new GetWardIDRequest(request.getFrom_province(), request.getFrom_district(), request.getFrom_ward())
                ).toString()
        );
        data.put("to_district_id", getDistrictIdByName(
                new GetDistrictIDRequest(request.getTo_province(), request.getTo_district()))
        );
        data.put("to_ward_code", getWardIdByName(
                    new GetWardIDRequest(request.getTo_province(), request.getTo_district(), request.getTo_ward())
                ).toString()
        );
        data.put("service_id", 53320);

//        log.info("data: {}", data);
        return ghnApiUtil.callGhnApi("/v2/shipping-order/leadtime", HttpMethod.POST, data);
    }

    @Override
    public Object getOrderDetails(Object data) {
        return ghnApiUtil.callGhnApi("/v2/shipping-order/detail", HttpMethod.POST, data);
    }

    @Override
    public Object reDeliveryOrder(Object data) {
        HttpHeaders headers = ghnApiUtil.createHeaders();
        headers.set("ShopId", userService.getShopId());
        return ghnApiUtil.callGhnApi("/v2/switch-status/storing", HttpMethod.POST, data);
    }

    // Hàm xử lý chuỗi, chuẩn hóa tên
    private String normalizeString(String input) {
        if (input == null) {
            return "";
        }
        return input.trim().replaceAll("\\s+", " ");
    }

    @Override
    public Integer getProvinceIdByName(GetProvinceIDRequest request) {
        String provinceName = normalizeString(request.getProvinceName());

        // Lấy danh sách các tỉnh
        Object response = getProvinces();
        if (response == null) {
            return null;
        }

        // Chuyển đổi response thành JsonNode
        JsonNode jsonNode = objectMapper.convertValue(response, JsonNode.class);

        // Duyệt qua từng tỉnh trong response
        for (JsonNode item : jsonNode) {
            JsonNode nameExtensionListNode = item.path("NameExtension");
            JsonNode provinceIdNode = item.path("ProvinceID");

            if (nameExtensionListNode.isArray() && provinceIdNode.isNumber()) {
                // Duyệt qua các tên mở rộng của tỉnh
                for (JsonNode nameNode : nameExtensionListNode) {
                    if (nameNode.isTextual() && nameNode.asText().equalsIgnoreCase(provinceName)) {
                        // Trả về ProvinceID nếu tìm thấy tên tỉnh
                        return provinceIdNode.asInt();
                    }
                }
            }
        }

        // Nếu không tìm thấy
        return null;
    }

    @Override
    public Integer getDistrictIdByName(GetDistrictIDRequest request) {
        String provinceName = normalizeString(request.getProvinceName());
        String districtName = normalizeString(request.getDistrictName());

        // Lấy provinceId từ tên tỉnh
        GetProvinceIDRequest provinceRequest = new GetProvinceIDRequest(provinceName);
        Integer provinceId = getProvinceIdByName(provinceRequest);

        if (provinceId == null) {
            return null;
        }

        // Gọi API để lấy danh sách quận/huyện
        Object response = getDistricts(provinceId);
        if (response == null) {
            return null;
        }

        // Chuyển đổi response thành JsonNode
        JsonNode jsonNode = objectMapper.convertValue(response, JsonNode.class);

        // Duyệt qua từng quận/huyện trong response
        for (JsonNode item : jsonNode) {
            JsonNode nameExtensionListNode = item.path("NameExtension");
            JsonNode districtIdNode = item.path("DistrictID");

            if (nameExtensionListNode.isArray() && districtIdNode.isNumber()) {
                // Duyệt qua các tên mở rộng của quận/huyện
                for (JsonNode nameNode : nameExtensionListNode) {
                    if (nameNode.isTextual() && nameNode.asText().equalsIgnoreCase(districtName)) {
                        // Trả về DistrictID nếu tìm thấy tên quận/huyện
                        return districtIdNode.asInt();
                    }
                }
            }
        }

        // Nếu không tìm thấy
        return null;
    }

    @Override
    public Integer getWardIdByName(GetWardIDRequest request) {
        String provinceName = normalizeString(request.getProvinceName());
        String districtName = normalizeString(request.getDistrictName());
        String wardName = normalizeString(request.getWardName());

        // Lấy districtId từ tên tỉnh và quận/huyện
        Integer districtId = getDistrictIdByName(new GetDistrictIDRequest(provinceName, districtName));
        if (districtId == null) return null;

        // Gọi API để lấy danh sách phường/xã
        Object response = getWards(districtId);
        if (response == null) return null;

        // Chuyển đổi response sang JsonNode
        JsonNode jsonNode = objectMapper.convertValue(response, JsonNode.class);

        // Kiểm tra nếu response là một danh sách và duyệt qua các phần tử
        for (JsonNode item : jsonNode) {
            JsonNode nameExtensionListNode = item.path("NameExtension");
            JsonNode wardCodeNode = item.path("WardCode");

            if (nameExtensionListNode.isArray() && wardCodeNode.isTextual()) {
                // Kiểm tra nếu tên phường/xã có trong mảng NameExtension
                boolean isMatch = false;
                for (JsonNode nameNode : nameExtensionListNode) {
                    if (nameNode.isTextual() && nameNode.asText().equalsIgnoreCase(wardName)) {
                        isMatch = true;
                        break;
                    }
                }

                if (isMatch) {
                    return Integer.parseInt(wardCodeNode.asText());
                }
            }
        }

        // Nếu không tìm thấy
        return null;
    }

    @Transactional
    public User createShopInfo(User user) throws IdInvalidException, JsonProcessingException {
        // Lấy user từ DB và kiểm tra id có tồn tại không
        User dbUser = userService.findUserByEmail(user.getEmail());

        if (user.getShopName() != null) {
            dbUser.setShopName(user.getShopName());
        } else {
            dbUser.setShopName("Shop " + dbUser.getFullName());
        }

        if (user.getPhone() != null) {
            dbUser.setPhone(user.getPhone());
        }

        Address shopAddress = addressRepository.findByAddressId(user.getShopAddressId()).orElse(null);

        GetDistrictIDRequest districtRequest = new GetDistrictIDRequest(shopAddress.getCity(), shopAddress.getDistrict());
        GetWardIDRequest wardRequest = new GetWardIDRequest(shopAddress.getCity(), shopAddress.getDistrict(), shopAddress.getWard());
        ReqCreateShop reqCreateShop = ReqCreateShop.builder()
                .name(dbUser.getShopName())
                .phone(dbUser.getPhone())
                .address(shopAddress.getStreet() + ", " + shopAddress.getWard() + ", " + shopAddress.getDistrict() + ", " + shopAddress.getCity())
                .district_id(getDistrictIdByName(districtRequest))
                .ward_code(String.valueOf(getWardIdByName(wardRequest)))
                .build();

        Object createdShop = createShop(reqCreateShop);
        JsonNode jsonNode = objectMapper.convertValue(createdShop, JsonNode.class);

        String shopId = jsonNode.path("shop_id").asText();
        dbUser.setShopId(shopId);

        dbUser.setShopAddressId(user.getShopAddressId());
        return userRepository.save(dbUser);
    }

}
