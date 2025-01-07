import { Modal, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ isModalVisible, setIsModalVisible }) => {
    const navigate = useNavigate();
    const handleLogin = () => {
        setIsModalVisible(false);
        navigate("/auth/login");
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <Modal
            title={
                <Typography.Title level={4} className="text-center text-white">
                    Thông báo
                </Typography.Title>
            }
            open={isModalVisible}
            onOk={handleLogin}
            onCancel={handleCancel}
            okText="Đăng nhập"
            cancelText="Hủy"
            okButtonProps={{ className: "bg-blue-500 hover:bg-blue-600 text-white" }}
            cancelButtonProps={{ className: "text-gray-500 hover:text-gray-700" }}
            className="custom-modal"
            centered
        >
            <p className="text-lg text-gray-600 text-center mb-4">
                Bạn cần đăng nhập để sản phẩm vào giỏ hàng.
            </p>
        </Modal>
    )
};

export default LoginModal;
