import { Row, Col, Typography } from "antd";

const { Text, Title } = Typography;

const ProductDetails = ({ details }) => {
    return (
        <div
            style={{
                padding: "16px",
                backgroundColor: "#fff",
                borderRadius: "4px",
                marginTop: "16px",
            }}
        >
            {/* Tiêu đề */}
            <Title
                level={4}
                style={{
                    marginBottom: "16px",
                    fontSize: "16px", // Cỡ chữ nhỏ hơn
                    fontWeight: "bold",
                    color: "#333",
                    border: "1px solid #eaeaea", // Viền nhẹ giống Shopee
                    padding: "8px", // Khoảng cách giữa viền và chữ
                    backgroundColor: "#f9f9f9", // Nền xám nhạt
                }}
            >
                CHI TIẾT SẢN PHẨM
            </Title>

            {/* Chi tiết sản phẩm */}
            <Row gutter={[16, 16]} style={{ fontSize: "14px", lineHeight: "1.8" }}>
                {/* Danh mục */}
                <Col span={8}>
                    <Text strong style={{ color: "#555" }}>Danh Mục:</Text>
                </Col>
                <Col span={16}>
                    <Text
                        style={{
                            color: "#0056b3",
                            textDecoration: "underline",
                            cursor: "pointer",
                        }}
                    >
                        Shopee - Nhà Sách Online - Bút viết - Viết Máy & Mực
                    </Text>
                </Col>

                {/* Kho */}
                <Col span={8}>
                    <Text strong style={{ color: "#555" }}>Kho:</Text>
                </Col>
                <Col span={16}>
                    <Text style={{ color: "#333" }}>{details.stock}</Text>
                </Col>

                {/* Loại bút */}
                <Col span={8}>
                    <Text strong style={{ color: "#555" }}>Loại bút:</Text>
                </Col>
                <Col span={16}>
                    <Text style={{ color: "#333" }}>Bút nước</Text>
                </Col>

                {/* Gửi từ */}
                <Col span={8}>
                    <Text strong style={{ color: "#555" }}>Gửi từ:</Text>
                </Col>
                <Col span={16}>
                    <Text style={{ color: "#333" }}>{details.shippingFrom}</Text>
                </Col>
            </Row>
        </div>
    );
};

export default ProductDetails;
