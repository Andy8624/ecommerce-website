import { Select } from "antd"
const { Option } = Select;

const OrderDetailSelectStatus = ({ onStatusChange }) => {
    return (
        <div className="mb-4">
            <Select
                defaultValue="ALL"
                style={{ width: 170 }}
                onChange={onStatusChange}
            >
                <Option value="ALL">Tất cả</Option>
                <Option value="SUCCESS">Đã hoàn thành</Option>
                <Option value="PENDING">Chờ xác nhận</Option>
                <Option value="CONFIRMED">Đã xác nhận</Option>
                <Option value="SHIPPED">Đang vận chuyển</Option>
                <Option value="DELIVERED">Đã giao</Option>
                <Option value="RETURN_REQUESTED">Yêu cầu hoàn trả</Option>
                <Option value="CANCELLED">Đã hủy</Option>
                <Option value="RETURN_SUCCEEDED">Hoàn trả thành công</Option>
                <Option value="RETURN_REFUSED">Hoàn trả bị từ chối</Option>
            </Select>

        </div>)
}

export default OrderDetailSelectStatus