import { Button, Col, Divider, InputNumber, Row, Typography, Carousel } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TOOL_URL } from "../utils/Config";
import { useGetToolByToolId } from "../features/checkout/hooks/useGetToolByToolId";
import { handleAddToCart } from "../features/cart/handleAddtoCart";
import { useSelector } from "react-redux";
import { useCart } from "../features/cart/hooks/useCart";
import { useCartContext } from "../components/CartProvider";
import { useCreateCartTool } from "../features/cart/hooks/useCreateCartTool";
import { useUpdateCartItem } from "../features/cart/hooks/useUpdateCartItem";
import { useCheckExistCartTool } from "../features/cart/hooks/useCheckExistCartTool";
import { truncateDescription } from "../utils/truncaseDesc";
import { toast } from "react-toastify";

const { Title, Text, Paragraph } = Typography;

const ProductDetailPage = () => {
    const { toolId } = useParams();
    const navigate = useNavigate();
    const { getToolByToolId, isLoadingTool, error } = useGetToolByToolId();
    const {
        cartItems, setCartItems,
        cartQuantity, setCartQuantity,
    } = useCartContext();
    const userId = useSelector(state => state?.account?.user?.id);
    const permissions = useSelector(state => state.account.user?.role?.permissions);
    const { carts } = useCart(userId);

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [showFullDescription, setShowFullDescription] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            const productData = await getToolByToolId(toolId);
            setProduct(productData);
        };

        if (toolId) {
            fetchProduct();
        }
    }, [toolId, getToolByToolId]);

    const { createCartItem } = useCreateCartTool();
    const { updateCartItem } = useUpdateCartItem();
    const { checkExist } = useCheckExistCartTool();

    const onQuantityChange = (value) => {
        setQuantity(value);

    };

    const onAddToCart = async () => {
        // console.log(quantity);
        if (product && quantity > 0) {
            await handleAddToCart({
                tool: product,
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
            });
        }
    };



    const handleBuyNow = async () => {
        const buyNowItem = {
            product,
            quantity,
            userId
        }
        navigate('/checkout', { state: { buyNowItem: buyNowItem } });
    };



    if (isLoadingTool) {
        return <div>Đang tải thông tin sản phẩm...</div>;
    }

    if (error) {
        return <div>Đã xảy ra lỗi: {error.message}</div>;
    }

    return (
        <div className="product-detail-container p-6 bg-gray-100 shadow-lg rounded-lg">
            {product ? (
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={12}>
                        <Carousel autoplay dots draggable>
                            {Array(3).fill().map((_, index) => (
                                <div key={index}>
                                    <img
                                        src={TOOL_URL + product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-96 object-cover rounded-lg shadow"
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </Col>
                    <Col xs={24} md={12}>
                        {/* {console.log(product)} */}
                        <Paragraph className="mt-2 text-lg font-bold">
                            <Text className="text-gray-900 text-xl">{product.name}</Text>
                        </Paragraph>
                        <Paragraph className="mt-2 text-lg font-bold">
                            Giá: {product.discountedPrice > 0 ? (
                                <>
                                    <Text delete className="text-gray-400">{product.price.toLocaleString()}₫</Text>
                                    <Text className="text-red-600 ml-2">{product.discountedPrice.toLocaleString()}₫</Text>
                                </>
                            ) : (
                                <Text className="text-green-600">{product.price.toLocaleString()}₫</Text>
                            )}
                        </Paragraph>
                        <Paragraph className="text-gray-500">Kho: {product.stockQuantity} sản phẩm</Paragraph>

                        <Paragraph className="flex items-center">
                            <Text className="font-bold text-black mr-1">Cửa hàng:</Text>
                            <Text
                                className="text-blue-400 hover:text-blue-700 font-semibold cursor-pointer scale-100 transition-all duration-200"
                                // onClick={() => navigate(`/user/${product.user.userId}`)}
                                onClick={() => toast.warn("Chức năng đang được phát triển.")}
                            >
                                {product.user.fullName}
                            </Text>
                        </Paragraph>
                        <Divider />

                        <Title level={5}>Mô tả sản phẩm</Title>
                        <Paragraph>
                            {showFullDescription
                                ? product.description
                                : truncateDescription(product.description, 80)}
                        </Paragraph>
                        {!showFullDescription && product.description.split(" ").length > 100 && (
                            <Button
                                type="link"
                                onClick={() => setShowFullDescription(true)}
                                className="p-0"
                            >
                                Xem thêm...
                            </Button>
                        )}

                        <Row gutter={[8, 8]} className="mt-4 align-items-center">
                            <Col>
                                <Text>Số lượng:</Text>
                                <InputNumber
                                    min={1}
                                    max={product.stockQuantity}
                                    value={quantity}
                                    onChange={onQuantityChange}
                                    className="ml-2"
                                    style={{ width: "100px" }}
                                />
                            </Col>
                        </Row>

                        <Row gutter={[8, 8]} className="mt-4">
                            <Col>
                                <Button
                                    type="primary"
                                    onClick={onAddToCart}
                                    disabled={product.stockQuantity <= 0}
                                    className="bg-orange-500 border-none rounded-md hover:bg-orange-600 transition-all duration-300"
                                >
                                    Thêm vào giỏ hàng
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    type="danger"
                                    onClick={handleBuyNow}
                                    disabled={product.stockQuantity <= 0}
                                    className="rounded-md hover:bg-red-600 transition-all duration-300"
                                >
                                    Mua ngay
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            ) : (
                <div>Không tìm thấy sản phẩm.</div>
            )}
        </div>
    );
};

export default ProductDetailPage;
