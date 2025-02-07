import { Col, Typography, Rate, Select, InputNumber, Row, Button } from "antd";
import { useState } from "react";
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const ProductInfo = ({
    name,
    rating,
    reviewCount,
    price,
    discountedPrice,
    stockQuantity,
    options,
}) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedOption, setSelectedOption] = useState(options[0]?.id);

    return (
        <Col xs={24} md={12}>
            <Title level={4}>{name}</Title>

            {/* Tỷ lệ đánh giá */}
            <div className="rating-section mb-4">
                <Rate allowHalf defaultValue={rating} disabled />
                <Text className="ml-2">({reviewCount} đánh giá)</Text>
            </div>

            {/* Giá */}
            <Paragraph>
                Giá:{" "}
                {discountedPrice > 0 ? (
                    <>
                        <Text delete className="text-gray-400">
                            {price.toLocaleString()}₫
                        </Text>
                        <Text className="text-red-600 ml-2">
                            {discountedPrice.toLocaleString()}₫
                        </Text>
                    </>
                ) : (
                    <Text className="text-green-600">{price.toLocaleString()}₫</Text>
                )}
            </Paragraph>

            {/* Vận chuyển */}
            <Paragraph className="text-gray-500">
                Vận chuyển: Nhận vào 14 Th01, phí giao 40₫
            </Paragraph>

            {/* Bộ lọc */}
            <Paragraph>
                <Text>Chọn tùy chọn:</Text>
                <Select
                    className="ml-2"
                    value={selectedOption}
                    onChange={(value) => setSelectedOption(value)}
                    style={{ width: 200 }}
                >
                    {options.map((opt) => (
                        <Option key={opt.id} value={opt.id}>
                            {opt.name} ({opt.stock} sản phẩm)
                        </Option>
                    ))}
                </Select>
            </Paragraph>

            {/* Số lượng */}
            <Paragraph>
                <Text>Số lượng:</Text>
                <InputNumber
                    min={1}
                    max={stockQuantity}
                    value={quantity}
                    onChange={(value) => setQuantity(value)}
                    className="ml-2"
                    style={{ width: "100px" }}
                />
            </Paragraph>

            {/* Nút hành động */}
            <Row gutter={[8, 8]} className="mt-4">
                <Col>
                    <Button
                        type="primary"
                        className=" border-none rounded-md transition-all duration-300"
                        style={{ backgroundColor: "#8294C4" }}
                    >
                        Thêm vào giỏ hàng
                    </Button>
                </Col>
                <Col>
                    <Button
                        type="danger"
                        className="rounded-md hover:bg-red-600 transition-all duration-300"
                    >
                        Mua ngay
                    </Button>
                </Col>
            </Row>
        </Col>
    );
};

export default ProductInfo;
