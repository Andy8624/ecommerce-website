import { Row, Col, Typography } from "antd";
import { Fragment } from "react";

const { Text, Title } = Typography;

const ProductDetails = ({ details, moreDetails }) => {
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
            <h4 className="text-2xl text-gray-800 mb-5">
                CHI TIẾT SẢN PHẨM
            </h4>

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

                {/* More details */}
                {moreDetails?.map((detail) => (
                    <Fragment key={detail.id}>
                        <Col span={8}>
                            <Text strong style={{ color: "#555" }}>
                                {detail.name}:
                            </Text>
                        </Col>
                        <Col span={16}>
                            <Text style={{ color: "#333" }}>{detail.value}</Text>
                        </Col>
                    </Fragment>
                ))}
            </Row>
        </div>
    );
};

export default ProductDetails;
