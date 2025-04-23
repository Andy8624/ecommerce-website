import { useEffect, useMemo, useState } from 'react';
import { Layout } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckoutSummary from '../features/checkout/Components/CheckoutSummary';
import CheckoutForm from '../features/checkout/Components/CheckoutForm';
import { useCreateOrder } from '../features/checkout/hooks/orders/useCreateOrder';
import { useSelector } from 'react-redux';
import { useGetAllPaymentMethod } from '../features/checkout/hooks/payment-methods/usePaymentMethod';
import { toast } from 'react-toastify';
import { useCartContext } from '../hooks/useCartContext';
import { useAddressUser } from '../hooks/useAddressUser';
import { saveInteraction } from "../services/RecomendationService"; // Import saveInteraction

import useShippingCostMutation from "../hooks/useShippingCost";
import OrderProductList from '../features/checkout/Components/OrderProductList';
const { Content } = Layout;

const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const buyNowItem = location.state?.buyNowItem;
    const checkoutProduct = location.state?.checkoutProduct;

    // Thêm state cho phí vận chuyển khi mua ngay
    const [buyNowShippingCost, setBuyNowShippingCost] = useState(0);

    const {
        selectedItems
    } = useCartContext();

    const [isBuyNow, setIsBuyNow] = useState(false);

    useEffect(() => {
        // Kiểm tra nếu là mua ngay từ tham số truyền vào
        if (buyNowItem) {
            setIsBuyNow(true);
        } else if (selectedItems?.length == 0) {
            setIsBuyNow(true);
        }
    }, [buyNowItem, selectedItems]);

    const user = useSelector(state => state?.account?.user);
    const userId = user?.id;

    // Lấy danh sách địa chỉ của người dùng
    const { addresses } = useAddressUser(userId);
    const [addressUser, setAddressUser] = useState(addresses);
    useEffect(() => {
        setAddressUser(addresses);
    }, [addresses]);
    const [selectedAddress, setSelectedAddress] = useState(addressUser && addressUser?.length > 0 ? addressUser[0] : null);

    // Lấy danh sách phương thức thanh toán
    const { paymentMethods: paymentMethodDB } = useGetAllPaymentMethod();
    const [paymentMethod, setPaymentMethod] = useState(paymentMethodDB);
    console.log("paymentMethod", paymentMethod);
    useEffect(() => {
        setPaymentMethod(paymentMethodDB);
    }, [paymentMethodDB]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethodDB && paymentMethodDB?.length > 0 ? paymentMethodDB[0] : null);
    // console.log("selectedPaymentMethod", selectedPaymentMethod);

    const groupedCheckoutProducts = useMemo(() => {
        if (!checkoutProduct) return {};

        return checkoutProduct?.reduce((acc, product) => {
            const sellerId = product?.ownerUser?.userId;

            if (!acc[sellerId]) {
                acc[sellerId] = {
                    seller: product?.ownerUser,
                    products: [],
                    totalSellerAmount: 0,
                    shippingCost: 0,
                };
            }

            acc[sellerId].products.push(product);
            acc[sellerId].totalSellerAmount += (product?.price * product?.quantity);
            return acc;
        }, {});
    }, [checkoutProduct]);

    const { calculateShippingCostAsync } = useShippingCostMutation();


    useEffect(() => {
        const calculateShippingCosts = async () => {
            if (addressUser && addressUser?.length > 0) {
                for (const sellerGroup of Object.values(groupedCheckoutProducts)) {
                    try {
                        let result;
                        if (selectedAddress != null) {
                            result = await calculateShippingCostAsync({
                                products: sellerGroup?.products,
                                buyerAddress: selectedAddress,
                            });
                        } else {
                            result = await calculateShippingCostAsync({
                                products: sellerGroup?.products,
                                buyerAddress: addressUser[0],
                            });
                        }
                        sellerGroup.shippingCost = result?.total || 0;
                    } catch (err) {
                        console.error("Error calculating shipping cost:", err);
                    }
                }
            }
        };
        calculateShippingCosts();
    }, [groupedCheckoutProducts, addressUser, calculateShippingCostAsync, selectedAddress]);

    // Đoạn code đã có trong file Checkout.jsx - kiểm tra lại để đảm bảo tính nhất quán

    // Xử lý phí vận chuyển cho mua ngay
    useEffect(() => {
        const calculateBuyNowShippingCost = async () => {
            if (isBuyNow && buyNowItem && addressUser && addressUser.length > 0) {
                console.log("buyNowItem", buyNowItem)
                try {
                    const result = await calculateShippingCostAsync({
                        products: [buyNowItem?.product], // Chuyển sản phẩm mua ngay thành mảng
                        buyerAddress: selectedAddress || addressUser[0],
                    });
                    // Lưu phí vận chuyển vào state
                    setBuyNowShippingCost(result?.total || buyNowItem?.shippingCost || 0);
                } catch (err) {
                    console.error("Error calculating shipping cost for buy now item:", err);
                }
            }
        };

        calculateBuyNowShippingCost();
    }, [isBuyNow, buyNowItem, addressUser, selectedAddress, calculateShippingCostAsync]);

    let totalAmount = 0;
    let totalShippingCost = 0;

    if (isBuyNow) {
        const buyNowPrice = buyNowItem?.product?.discountedPrice || buyNowItem?.product?.price;
        totalAmount = buyNowItem?.quantity * buyNowPrice;
        // Cập nhật totalShippingCost với buyNowShippingCost khi đang ở mode mua ngay
        totalShippingCost = buyNowShippingCost;
        console.log('Mua ngay - Sản phẩm:', buyNowItem, 'Phí ship:', buyNowShippingCost);
    } else {
        // Tính tổng tiền từ groupedCheckoutProducts
        totalAmount = Object.values(groupedCheckoutProducts).reduce((total, seller) => {
            return total + seller.totalSellerAmount;
        }, 0);

        totalShippingCost = Object.values(groupedCheckoutProducts).reduce((total, seller) => {
            return total + seller.shippingCost;
        }, 0);
    }
    // console.log("totalShippingCost", totalShippingCost);


    useEffect(() => {
        setTimeout(() => {
            if (isNaN(totalAmount)) {
                navigate("/cart");
            }
        }, 3000);
    }, [totalAmount, navigate]);

    const { createOrder } = useCreateOrder();

    // Hàm ghi nhận tương tác mua hàng
    const logPurchaseInteraction = (userId, productId, quantity) => {
        if (!userId || !productId) return;

        try {
            // Ghi nhận tương tác PURCHASE với sản phẩm và số lượng
            saveInteraction(userId, productId, 'PURCHASE', quantity);
            console.log(`Logged PURCHASE interaction: User ${userId} bought product ${productId}, quantity: ${quantity}`);
        } catch (error) {
            console.error("Error logging purchase interaction:", error);
        }
    };

    const [loading, setIsloading] = useState(false);

    const handleCheckout = async () => {
        try {
            // Kiểm tra đầu vào
            if (selectedAddress == null) {
                toast.error("Vui lòng chọn địa chỉ giao hàng");
                return;
            }
            if (selectedPaymentMethod == null) {
                toast.error("Vui lòng chọn phương thức thanh toán");
                return;
            }

            setIsloading(true);

            // Xử lý đơn hàng từ giỏ hàng
            if (!isBuyNow) {

                for (const sellerGroup of Object.values(groupedCheckoutProducts)) {
                    try {
                        console.log("sellerGroup products", sellerGroup?.products);
                        const order = {
                            status: "pending",
                            shippingCost: sellerGroup?.shippingCost,
                            totalToolCost: sellerGroup?.totalSellerAmount,
                            user: {
                                userId: userId,
                                email: user?.email,
                                imageUrl: user?.imageUrl,
                                phone: user?.phone,
                                fullName: user?.fullName,
                            },
                            cartId: user?.cartId,
                            paymentMethod: selectedPaymentMethod,
                            address: selectedAddress,
                            type: "PRODUCT",
                            orderTools: sellerGroup?.products,
                            shopId: sellerGroup?.products[0]?.ownerUser?.userId,
                        }

                        const data = await createOrder(order);


                        if (data === null) {
                            toast.warning("Sản phẩm bạn đặt đã hết, xin hãy quay lại sau!");
                            navigate("/cart");
                            return;
                        } else {
                            // Ghi nhận tương tác mua hàng cho từng sản phẩm trong đơn hàng
                            sellerGroup.products.forEach(product => {
                                logPurchaseInteraction(
                                    userId,
                                    product.toolId,
                                    product.quantity
                                );
                            });
                        }
                    } catch (orderError) {
                        console.error("Lỗi khi tạo đơn hàng:", orderError);
                        toast.error(`Lỗi khi xử lý đơn hàng từ shop ${sellerGroup?.seller?.fullName || 'không xác định'}: ${orderError.message || 'Không thể tạo đơn hàng'}`);
                        // Tiếp tục với seller tiếp theo nếu có lỗi với một seller
                    }
                }
            }

            // Xử lý đơn hàng mua ngay
            else if (isBuyNow && buyNowItem) {
                try {
                    // Tạo đơn hàng cho mua ngay
                    const buyNowPrice = buyNowItem?.product?.discountedPrice || buyNowItem?.product?.price;
                    const buyNowOrder = {
                        status: "pending",
                        shippingCost: buyNowShippingCost, // Sử dụng phí vận chuyển đã tính
                        totalToolCost: buyNowItem.quantity * buyNowPrice,
                        user: {
                            userId: userId,
                            email: user?.email,
                            imageUrl: user?.imageUrl,
                            phone: user?.phone,
                            fullName: user?.fullName,
                        },
                        paymentMethod: selectedPaymentMethod,
                        address: selectedAddress,
                        type: "PRODUCT",
                        orderTools: [
                            {
                                ...buyNowItem.product,
                                quantity: buyNowItem.quantity
                            }
                        ],
                        shopId: buyNowItem.product?.ownerUser?.userId,
                    };

                    const buyNowData = await createOrder(buyNowOrder);

                    if (buyNowData === false) {
                        toast.warning("Sản phẩm bạn đặt đã hết, xin hãy quay lại sau!");
                        navigate(-1); // Quay lại trang trước
                        return;
                    } else {
                        // Ghi nhận tương tác mua hàng
                        logPurchaseInteraction(
                            userId,
                            buyNowItem.product.toolId,
                            buyNowItem.quantity
                        );
                    }
                } catch (buyNowError) {
                    console.error("Lỗi khi xử lý đơn hàng mua ngay:", buyNowError);
                    toast.error(`Lỗi khi xử lý đơn hàng mua ngay: ${buyNowError.message || 'Không thể tạo đơn hàng'}`);
                    navigate(-1);
                    return;
                }
            }

            setIsloading(false);

            // Xử lý thành công
            toast.success("Đặt hàng thành công");
            navigate("/");

        } catch (error) {
            console.error("Lỗi tổng thể khi thanh toán:", error);
            toast.error(`Có lỗi xảy ra trong quá trình đặt hàng: ${error.message || 'Vui lòng thử lại sau'}`);
        }
    };

    return (
        <Layout className="min-h-screen bg-gradient-to-r from-indigo-100 to-purple-200 flex items-center justify-center">
            <Content className="w-[80%] p-4 ">

                <h2 className="text-center font-bold text-2xl mb-3 p-3 bg-white shadow-lg rounded-lg text-[var(--primary-color)]">
                    Thanh toán
                </h2>

                <CheckoutForm
                    addressUser={addressUser}
                    setSelectedAddress={setSelectedAddress}
                    paymentMethodDB={paymentMethodDB}
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
                    userId={userId}
                />

                {/* Hiển thị danh sách sản phẩm theo từng người bán */}
                <OrderProductList groupedCheckoutProducts={groupedCheckoutProducts} />

                <CheckoutSummary
                    totalAmount={totalAmount}
                    shipCost={totalShippingCost}
                    onConfirm={handleCheckout}
                    loading={loading}
                />

            </Content>
        </Layout >
    );
};

export default CheckoutPage;
