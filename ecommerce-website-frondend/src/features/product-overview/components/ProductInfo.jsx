import { TruckOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Col, Typography, Rate, InputNumber, Row } from "antd";
import { useEffect, useState } from "react";
import { getTotalSoldQuantity } from "../../../services/OrderToolService";
import { useSelector } from "react-redux";
import { callCalculateShippingCost, callGetTimeDelivery } from "../../../services/GHNService";
import { useAddressUser } from "../../../hooks/useAddressUser";
import { useCategory } from "../hooks/useCategory";
import { useUpdateCartItem } from "../../cart/hooks/useUpdateCartItem";
import { handleAddToCart } from "../../cart/handleAddtoCart";
import { useCartContext } from "../../../hooks/useCartContext";
import { useCart } from "../../cart/hooks/useCart";
import { useCreateCartTool } from "../../cart/hooks/useCreateCartTool";
import { useCheckExistCartTool } from "../../cart/hooks/useCheckExistCartTool";
import { toast } from "react-toastify";
const { Text, Paragraph } = Typography;

const ProductInfo = ({ tool }) => {
    const [quantity, setQuantity] = useState(1);
    const userId = useSelector(state => state?.account?.user?.id);
    const [selectedOption1, setSelectedOption1] = useState(null);
    const [selectedOption2, setSelectedOption2] = useState(null);
    const [detailPrice, setDetailPrice] = useState(null);
    const [detailStock, setDetailStock] = useState(null);
    const [variantDetailId1, setVariantDetailId1] = useState(null);
    const [variantDetailId2, setVariantDetailId2] = useState(null);

    const categoryDetailId1 = tool?.variants[0]?.attributes[0]?.categoryDetailId;
    const categoryDetailId2 = tool?.variants[0]?.attributes[1]?.categoryDetailId;
    const { category: category1 } = useCategory(categoryDetailId1);
    const { category: category2 } = useCategory(categoryDetailId2);

    // const minPrice = tool?.variants.reduce((min, v) =>
    //     (v.price < min ? v.price : min),
    //     tool?.variants[0]?.price
    // );

    // const maxPrice = tool?.variants.reduce((max, v) =>
    //     (v.price > max ? v.price : max),
    //     tool?.variants[0]?.price
    // );
    // console.log(minPrice);
    // console.log(maxPrice);

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


    useEffect(() => {
        if (category1 && selectedOption1) {
            const variant = tool?.variants?.find((v) => {
                // Kiểm tra nếu có 1 hoặc 2 attributes
                if (v?.attributes.length === 1) {
                    return v.attributes[0]?.categoryDetailId === selectedOption1;
                }
                if (v?.attributes.length >= 2) {
                    return (
                        (v.attributes[0]?.categoryDetailId === selectedOption1 &&
                            v.attributes[1]?.categoryDetailId === selectedOption2) ||
                        (v.attributes[0]?.categoryDetailId === selectedOption2 &&
                            v.attributes[1]?.categoryDetailId === selectedOption1)
                    );
                }
                return false;
            });
            setDetailPrice(variant?.price);
            setDetailStock(variant?.stockQuantity);
            setVariantDetailId1(variant?.attributes[0]?.variantDetailId || null);
            setVariantDetailId2(variant?.attributes[1]?.variantDetailId || null);
        }
    }, [selectedOption1, selectedOption2, tool?.variants]); // Thêm tool?.variants vào dependency để đảm bảo cập nhật đúng


    const handleColorClick = (colorName) => {
        setSelectedOption1(colorName);
    };

    const handleCategory2Click = (optionName) => {
        setSelectedOption2(optionName);
    };

    // ---------------------------------------------------------

    const {
        cartItems, setCartItems,
        cartQuantity, setCartQuantity,
    } = useCartContext();
    const permissions = useSelector(state => state.account.user?.role?.permissions);
    const { carts } = useCart(userId);

    const { createCartItem } = useCreateCartTool();
    const { updateCartItem } = useUpdateCartItem();
    const { checkExist } = useCheckExistCartTool();
    const onAddToCart = async () => {
        if ((category1 && !selectedOption1) || (category2 && !selectedOption2)) {
            toast.error("Vui lòng chọn thuộc tính sản phẩm");
            return;
        }

        if (quantity > stockDetail) {
            toast.error("Số lượng sản phẩm không đủ");
            return;
        }
        if (quantity < 1) {
            toast.error("Số lượng sản phẩm không hợp lệ");
            return;
        }



        if (tool && quantity > 0) {
            await handleAddToCart({
                tool,
                permissions,
                carts,
                checkExist,
                createCartItem,
                updateCartItem,
                cartItems,
                setCartItems,
                cartQuantity,
                setCartQuantity,
                addQuantity: quantity,
                variantDetailId1,
                variantDetailId2
            });
        }
    };

    // const handleBuyNow = async () => {
    //     const buyNowItem = {
    //         product,
    //         quantity,
    //         userId
    //     }
    //     navigate('/checkout', { state: { buyNowItem: buyNowItem } });
    // };

    const formattedShippingCost = "₫" + (estimatedShippingCost?.total.toLocaleString() || "10,500");

    const stockDetail = detailStock == null ? tool?.stockQuantity : detailStock;
    // console.log("stockDetail", stockDetail);

    return (
        <Col xs={24} md={12}>
            <div className="text-3xl mb-4">{tool?.name}</div>

            {/* Tỷ lệ đánh giá */}
            <div className="rating-section mb-4">
                <Text className="me-2 underline">{tool?.averageRating}</Text>
                <Rate className='text-[#d0011b] text-[0.8rem] mx-[0px]' allowHalf defaultValue={tool?.averageRating} disabled />
                <span className="text-gray-400 mx-2 text-base">|</span>
                <Text className="me-2 underline">{tool?.totalRating}</Text>
                <Text className="text-gray-500">Đánh Giá</Text>
                <span className="text-gray-400 mx-2 text-base">|</span>
                <Text className="me-2 underline">{isLoadingTotalSoldQuantity ? "Loading" : totalSoldQuantity}</Text>
                <Text className="text-gray-500">Đã Bán</Text>
            </div>

            {/* Giá */}
            <div className="relative">
                {detailPrice ?
                    <Paragraph className="absolute left-50 p-3 bg-gray-50 w-[100%]">
                        <Text className="text-[#d0011b] mx-2 text-3xl">
                            ₫{detailPrice.toLocaleString()}
                        </Text>                    </Paragraph>
                    :
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
                            <Text className="text-[#d0011b] mx-2 text-3xl">
                                ₫{tool?.price.toLocaleString()}
                            </Text>
                        )}
                    </Paragraph>}
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
            {category1 && (
                <Paragraph>
                    <Text className="text-gray-500">{category1?.name}</Text>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {category1?.categoryDetails.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => handleColorClick(opt.id)}
                                style={{
                                    padding: '8px 12px',
                                    margin: '4px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    backgroundColor: selectedOption1 === opt.id ? '#e6f7ff' : 'white',
                                    cursor: 'pointer',
                                }}
                            >
                                {opt.name}
                            </button>
                        ))}
                    </div>
                </Paragraph>
            )}

            {/* Bộ lọc 2 */}
            {category2 && (
                <Paragraph>
                    <Text className="text-gray-500">{category2?.name}</Text>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {category2?.categoryDetails.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => handleCategory2Click(opt.id)}
                                style={{
                                    padding: '8px 12px',
                                    margin: '4px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    backgroundColor: selectedOption2 === opt.id ? '#e6f7ff' : 'white',
                                    cursor: 'pointer',
                                }}
                            >
                                {opt.name}
                            </button>
                        ))}
                    </div>
                </Paragraph>
            )}

            {/* Số lượng */}
            <Paragraph>
                <Text className="text-gray-500">Số lượng:</Text>
                <InputNumber
                    min={1}
                    max={stockDetail}
                    value={quantity}
                    onChange={(value) => setQuantity(value)}
                    className="ml-2"
                    style={{ width: "100px" }}
                />
                <Text className="ml-2 text-sx text-gray-500">({stockDetail} sản phẩm có sẵn)</Text>
            </Paragraph>

            {/* Nút hành động */}
            <Row gutter={[8, 8]} className="mt-4">
                <Col>
                    <button
                        onClick={onAddToCart}
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
