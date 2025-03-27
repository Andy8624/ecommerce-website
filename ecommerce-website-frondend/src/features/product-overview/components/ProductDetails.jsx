import { Row, Col, Typography } from "antd";

const { Text, Title } = Typography;

const ProductDetails = ({ details }) => {
    return (
        <div
            style={{
                padding: "1rem",
                backgroundColor: "#fff",
                borderRadius: "4px",
                marginTop: "16px",
            }}
        >
            {/* Tiêu đề */}
            <Title
                level={4}
                style={{
                    fontSize: "1.2rem",
                    fontWeight: "500",
                    color: "#333",
                    border: "1px solid #eaeaea",
                    padding: "0.9rem",
                    backgroundColor: "#f9f9f9",
                }}
            >
                CHI TIẾT SẢN PHẨM
            </Title>

            {/* Chi tiết sản phẩm */}
            <Row gutter={[16, 16]} style={{
                fontSize: "14px", lineHeight: "1.8", padding: "1rem",
            }}>
                {/* Loại sản phẩm */}
                <Col span={8}>
                    <Text strong style={{ color: "#555" }}>Loại sản phẩm:</Text>
                </Col>
                <Col span={16}>
                    <Text
                        style={{
                            color: "#0056b3",
                            textDecoration: "underline",
                            cursor: "pointer",
                        }}
                    >
                        {details?.category}
                    </Text>
                </Col>

                {/* Thương hiệu */}
                <Col span={8}>
                    <Text strong style={{ color: "#555" }}>Thương hiệu:</Text>
                </Col>
                <Col span={16}>
                    <Text>
                        {details?.brand}
                    </Text>
                </Col>

                {/* Kho */}
                <Col span={8}>
                    <Text strong style={{ color: "#555" }}>Kho:</Text>
                </Col>
                <Col span={16}>
                    <Text style={{ color: "#333" }}>{details?.stock}</Text>
                </Col>

                {/* Nguồn gốc xuất xứ */}
                <Col span={8}>
                    <Text strong style={{ color: "#555" }}>Xuất xứ:</Text>
                </Col>
                <Col span={16}>
                    <Text style={{ color: "#333" }}>{details?.origin}</Text>
                </Col>

                {/* Bảo hành */}
                <Col span={8}>
                    <Text strong style={{ color: "#555" }}>Bảo hành:</Text>
                </Col>
                <Col span={16}>
                    <Text style={{ color: "#333" }}>{details?.warranty}</Text>
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
