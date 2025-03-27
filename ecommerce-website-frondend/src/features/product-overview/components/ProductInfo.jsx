import { TruckOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Col, Typography, Rate, Select, InputNumber, Row } from "antd";
import { useState } from "react";
import { getTotalSoldQuantity } from "../../../services/OrderToolService";
import { getAddressByUserId } from "../../../services/AddressService";
import { useSelector } from "react-redux";
import { callCalculateShippingCost, callGetTimeDelivery } from "../../../services/GHNService";
import { useAddressUser } from "../../../hooks/useAddressUser";
const { Text, Paragraph } = Typography;
const { Option } = Select;

const ProductInfo = ({
    tool,
    options,
}) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedOption, setSelectedOption] = useState(options[0]?.id);
    const userId = useSelector(state => state?.account?.user?.id);


    const { isLoading: isLoadingTotalSoldQuantity, data: totalSoldQuantity } = useQuery({
        queryKey: ['totalSoldQuantity', tool?.toolId],
        queryFn: () => getTotalSoldQuantity(tool?.toolId),
        enabled: !!tool?.toolId,
        staleTime: 60 * 10 * 1000, // 10p
    })

    const { addresses } = useAddressUser(userId)


    // Caching theo ID của SHOP (nếu sản phẩm cùng shop thì không cần gọi lại)
    const { isLoading: isLoadingDeliveryTime, data: deliveryTime } = useQuery({
        queryKey: ['deliveryTime', tool?.user?.userId],
        queryFn: () => callGetTimeDelivery(
            {
                "from_province": addresses[0]?.city,
                "from_district": addresses[0]?.district,
                "from_ward": addresses[0]?.ward,
                "to_province": tool?.user?.address[0]?.city,
                "to_district": tool?.user?.address[0]?.district,
                "to_ward": tool?.user?.address[0]?.ward,
            }
        ),
        enabled: !!addresses,
        staleTime: Infinity,
    })

    const formattedDeliveryTime = deliveryTime?.leadtime
        ? new Date(deliveryTime.leadtime * 1000).toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            day: 'numeric',
            month: 'long',
            weekday: 'long',
        })
        : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            day: 'numeric',
            month: 'long',
            weekday: 'long',
        });

    // console.log(tool);

    // Caching theo ID của SHOP (nếu sản phẩm cùng shop thì không cần gọi lại)
    const { isLoading: isLoadingEstimatedShippingCost, data: estimatedShippingCost } = useQuery({
        queryKey: ['estimatedShippingCost', tool?.user?.userId],
        queryFn: () => callCalculateShippingCost(
            {
                "service_type_id": 2,
                "from_province": addresses[0]?.city,
                "from_district": addresses[0]?.district,
                "from_ward": addresses[0]?.ward,
                "to_province": tool?.user?.address[0]?.city,
                "to_district": tool?.user?.address[0]?.district,
                "to_ward": tool?.user?.address[0]?.ward,
                "length": tool?.length,
                "width:": tool?.width,
                "height": tool?.height,
                "weight": tool?.weight,
                "insurance_value": 0
            }
        ),
        enabled: !!addresses,
        staleTime: Infinity,
    })
    const formattedShippingCost = "₫" + (estimatedShippingCost?.total.toLocaleString() || "10,500");
    return (
        <Col xs={24} md={12}>
            <div className="text-3xl mb-4">{tool?.name}</div>

            {/* Tỷ lệ đánh giá */}
            <div className="rating-section mb-4">
                <Text className="me-2 underline">{tool?.averageRating}</Text>
                <Rate className='text-[0.8rem] mx-[0px]' allowHalf defaultValue={tool?.averageRating} disabled />
                <span className="text-gray-400 mx-2 text-base">|</span>
                <Text className="me-2 underline">{tool?.totalRating}</Text>
                <Text className="text-gray-500">Đánh Giá</Text>
                <span className="text-gray-400 mx-2 text-base">|</span>
                <Text className="me-2 underline">{isLoadingTotalSoldQuantity ? "Loading" : totalSoldQuantity}</Text>
                <Text className="text-gray-500">Đã Bán</Text>
            </div>

            {/* Giá */}
            <div className="relative">
                <Paragraph className="absolute left-50 p-3 bg-gray-50 w-[100%]">
                    {tool?.discountedPrice > 0 ? (
                        <>
                            <Text className="text-[#d0011b] mx-2 text-3xl">
                                ₫{tool?.discountedPrice.toLocaleString()}
                            </Text>
                            <Text delete className="text-gray-400 text-xl">
                                ₫{tool?.price.toLocaleString()}
                            </Text>
                        </>
                    ) : (
                        <Text className="text-green-600">{tool?.price.toLocaleString()}₫</Text>
                    )}
                </Paragraph>
            </div>

            {/* Vận chuyển */}
            <Paragraph className="mt-[5.5rem]">
                <Text className="text-gray-500">Vận chuyển: </Text>
                <TruckOutlined className="mx-2 text-base text-blue-400" />
                <Text className="text-gray-700 ">
                    Nhận vào {isLoadingDeliveryTime ? "Loading..." : formattedDeliveryTime}.
                    Phí giao {isLoadingEstimatedShippingCost ? "loading..." : formattedShippingCost} </Text>
            </Paragraph>

            {/* Bộ lọc 1 */}
            <Paragraph>
                <Text className="text-gray-500">Màu sắc:</Text>
                <Select
                    className="ml-2"
                    value={selectedOption}
                    onChange={(value) => setSelectedOption(value)}
                    style={{ width: "12rem" }}
                >
                    {options.map((opt) => (
                        <Option key={opt.id} value={opt.id}>
                            {opt.name} ({opt.stock} sản phẩm)
                        </Option>
                    ))}
                </Select>
            </Paragraph>

            {/* Bộ lọc 2 */}
            <Paragraph>
                <Text className="text-gray-500">Kích thước:</Text>
                <Select
                    className="ml-2"
                    value={selectedOption}
                    onChange={(value) => setSelectedOption(value)}
                    style={{ width: "12rem" }}
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
                <Text className="text-gray-500">Số lượng:</Text>
                <InputNumber
                    min={1}
                    max={tool?.stockQuantity}
                    value={quantity}
                    onChange={(value) => setQuantity(value)}
                    className="ml-2"
                    style={{ width: "100px" }}
                />
                <Text className="ml-2 text-sx text-gray-500">({tool?.stockQuantity} sản phẩm có sẵn)</Text>
            </Paragraph>

            {/* Nút hành động */}
            <Row gutter={[8, 8]} className="mt-4">
                <Col>
                    <button
                        className="px-4 py-2 
                        rounded transition-all duration-150 
                        border border-[var(--primary-color)]
                        bg-[var(--primary-color)] text-[var(--secondary-color)] font-bold 
                        hover:text-[var(--primary-color)] hover:bg-[var(--secondary-color)]"
                    >
                        Thêm vào giỏ hàng
                    </button>
                </Col>
                <Col>
                    <button
                        className="px-4 py-2 
                        rounded transition-all 
                        border
                        border-[var(--primary-color)] text-[var(--primary-color)] font-bold 
                        hover:bg-gray-200
                        "
                    >
                        Mua ngay
                    </button>
                </Col>
            </Row >
        </Col >
    );
};

export default ProductInfo;
