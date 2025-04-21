import { Button, Row, Col, Typography, message } from "antd";
import { useSelector } from "react-redux";

const { Text } = Typography;

const ShopInfo = ({ shop }) => {
    const currentUser = useSelector(state => state.account?.user);

    // Hàm xử lý khi click vào nút Chat Ngay
    const handleChatNow = () => {
        // console.log("Chat Now clicked", currentUser);
        // Kiểm tra nếu người dùng chưa đăng nhập
        if (currentUser?.id === '') {
            message.warning("Vui lòng đăng nhập để sử dụng tính năng chat");
            return;
        }

        // Đảm bảo có thông tin shop
        if (!shop || !shop.userId) {
            message.error("Không thể kết nối với shop này");
            return;
        }

        // Tạo contact object từ thông tin shop
        const shopContact = {
            userId: shop.userId,
            fullName: shop.name,
            imageUrl: shop.logo,
            shopName: shop.name,
            // Thêm các thông tin cần thiết khác
        };

        // CHỈ kích hoạt một sự kiện thay vì cả hai
        const openChatWindowEvent = new CustomEvent('openChatWindow', {
            detail: shopContact
        });
        window.dispatchEvent(openChatWindowEvent);
    };

    return (
        <Row
            gutter={[16, 16]}
            align="middle"
            style={{
                display: "flex",
                justifyContent: "space-between",
            }}
        >
            {/* Logo, tên shop và hành động */}
            <Col
                xs={24}
                md={7}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {/* Logo và tên shop */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginRight: "16px",
                    }}
                >
                    <img
                        src={shop.logo}
                        alt={shop.name}
                        style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            marginRight: "10px",
                        }}
                    />
                    <div>
                        <Text strong style={{ fontSize: "0.875rem" }}>
                            {shop.name}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: "0.75rem" }}>
                            Online {shop.lastOnline}
                        </Text>
                    </div>
                </div>

                {/* Nút hành động */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <Button
                        type="primary"
                        onClick={handleChatNow}
                        style={{
                            backgroundColor: "#FF6F61",
                            borderColor: "#FF6F61",
                            borderRadius: "6px",
                            width: "100px",
                            marginBottom: "8px",
                        }}
                    >
                        Chat Ngay
                    </Button>
                    <Button
                        type="default"
                        style={{
                            borderRadius: "6px",
                            width: "100px",
                        }}
                        onClick={() => { message.info("Chức năng đang phát triển") }}
                    >
                        Xem Shop
                    </Button>
                </div>
            </Col>

            {/* Đường kẻ đứng */}
            <div
                style={{
                    width: "1px",
                    height: "80px",
                    backgroundColor: "#d9d9d9",
                    margin: "0 1rem",
                }}
            ></div>

            {/* Thông tin shop */}
            <Col xs={24} md={15}>
                <Row gutter={[16, 8]}>
                    <Col span={8}>
                        <Text strong>Đánh Giá:</Text> <Text>{shop.reviews}</Text>
                    </Col>
                    <Col span={8}>
                        <Text strong>Tham Gia:</Text> <Text>{shop.joined}</Text>
                    </Col>
                    <Col span={8}>
                        <Text strong>Tỉ Lệ Phản Hồi:</Text> <Text>{shop.responseRate}%</Text>
                    </Col>
                    <Col span={8}>
                        <Text strong>Sản Phẩm:</Text> <Text>{shop.products}</Text>
                    </Col>
                    <Col span={8}>
                        <Text strong>Sản phẩm đã bán:</Text> <Text>{shop.soldProducts}</Text>
                    </Col>
                    <Col span={8}>
                        <Text strong>Thời Gian Phản Hồi:</Text> <Text>{shop.responseTime}</Text>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default ShopInfo;
