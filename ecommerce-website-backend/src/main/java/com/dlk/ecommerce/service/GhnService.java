package com.dlk.ecommerce.service;

import com.dlk.ecommerce.domain.entity.User;
import com.dlk.ecommerce.domain.request.ghn.GetDistrictIDRequest;
import com.dlk.ecommerce.domain.request.ghn.GetProvinceIDRequest;
import com.dlk.ecommerce.domain.request.ghn.GetWardIDRequest;
import com.dlk.ecommerce.domain.request.ghn.ReqCreateOrderGHN;
import com.dlk.ecommerce.util.error.IdInvalidException;
import com.fasterxml.jackson.core.JsonProcessingException;


/**
 * Interface định nghĩa các phương thức liên quan đến việc tích hợp API của GHN
 */
public interface GhnService {

    /**
     * Lấy danh sách các tỉnh/thành phố từ GHN API.
     *
     * @return Đối tượng chứa dữ liệu về các tỉnh/thành phố.
     */
    Object getProvinces();

    /**
     * Lấy danh sách các quận/huyện thuộc một tỉnh từ GHN API.
     *
     * @param provinceId ID của tỉnh/thành phố.
     * @return Đối tượng chứa dữ liệu về các quận/huyện.
     */
    Object getDistricts(int provinceId);

    /**
     * Lấy danh sách các phường/xã thuộc một quận từ GHN API.
     *
     * @param districtId ID của quận/huyện.
     * @return Đối tượng chứa dữ liệu về các phường/xã.
     */
    Object getWards(int districtId);

    /**
     * Tính phí vận chuyển thông qua GHN API.
     *
     * @param data Đối tượng chứa dữ liệu cần thiết để tính phí vận chuyển.
     * @return Đối tượng chứa thông tin phí vận chuyển.
     */
    Object calculateShippingCost(Object data);

    /**
     * Tạo mới một shop trên GHN API.
     *
     * @param data Đối tượng chứa thông tin của shop cần tạo.
     * @return Đối tượng chứa thông tin phản hồi từ GHN API.
     */
    Object createShop(Object data);

    /**
     * Lấy danh sách tất cả các shop của người dùng từ GHN API.
     *
     * @param data Đối tượng chứa các Pageable để phân trang.
     * @return Đối tượng chứa danh sách các shop.
     */
    Object getShops(Object data);

    /**
     *
     * @param data Đối tượng chứa thông tin đơn hàng cần tạo.
     * @return Đối tượng chứa thông tin phản hồi từ GHN API.
     */
    Object createOrder(ReqCreateOrderGHN data);

    /**
     *
     * @param data Danh sách mã đơn hàng cần hủy
     * @return Đối tượng chứa thông tin phản hồi từ GHN API.
     */
    Object cancelOrder(Object data);

    /**
     *
     * @param data Danh sách mã đơn hàng cần trả lại
     * @return Đối tượng chứa thông tin phản hồi từ GHN API.
     */
    Object returnOrder(Object data);

    /**
     *
     * @param data Đối tượng chứa thông tin đơn hàng cần tính thời gian giao hàng
     * @return Đối tượng chứa thông tin thời gian dự kiến giao hàng
     */
    Object getEstimatedDeliveryTime(Object data);

    /**
     *
     * @param data Mã đơn hàng cần lấy thông tin chi tiết
     * @return Đối tượng chứa thông tin chi tiết của đơn hàng
     */
    Object getOrderDetails(Object data);

    /**
     *
     * @param data Mã đơn hàng cần yêu cầu giao lại
     * @return Đối tượng chứa thông tin phản hồi từ GHN API.
     */
    Object reDeliveryOrder(Object data);

    User createShopInfo(User user) throws IdInvalidException, JsonProcessingException;


    Integer getProvinceIdByName(GetProvinceIDRequest request);
    Integer getDistrictIdByName(GetDistrictIDRequest request);
    Integer getWardIdByName(GetWardIDRequest request);
}
