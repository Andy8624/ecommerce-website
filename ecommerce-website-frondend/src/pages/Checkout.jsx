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

import useShippingCostMutation from "../hooks/useShippingCost";
import OrderProductList from '../features/checkout/Components/OrderProductList';
const { Content } = Layout;

const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const buyNowItem = location.state?.buyNowItem;
    const checkoutProduct = location.state?.checkoutProduct;

    const {
        cartItems, setCartItems,
        selectedItems, setSelectedItems,
        cartQuantity, setCartQuantity
    } = useCartContext();

    const [isBuyNow, setIsBuyNow] = useState(false);

    useEffect(() => {
        if (selectedItems?.length == 0) {
            setIsBuyNow(true);
        }
    }, [selectedItems]);

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

    let totalAmount = 0;
    let totalShippingCost = 0;

    if (isBuyNow) {
        const buyNowPrice = buyNowItem?.product?.discountedPrice || buyNowItem?.product?.price;
        totalAmount = buyNowItem?.quantity * buyNowPrice;
        console.log(buyNowItem);

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

    // console.log(groupedCheckoutProducts)
    const handleCheckout = async () => {
        if (selectedAddress == null) {
            toast.error("Vui lòng chọn địa chỉ giao hàng");
            return;
        }
        if (selectedPaymentMethod == null) {
            toast.error("Vui lòng chọn phương thức thanh toán");
            return;
        }

        for (const sellerGroup of Object.values(groupedCheckoutProducts)) {
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
            if (data === false) {
                toast.warning("Sản phẩm bạn đặt đã hết, xin hãy quay lại sau!");
                navigate("/cart");
                return;
            } else {
                toast.success("Đặt hàng thành công");
                navigate("/");
            }


            // -------------------------------------------------

            // // Mua ngay
            // if (selectedItems?.length == 0) {
            //     let newOrderItem = {
            //         quantity: buyNowItem?.quantity,
            //         order: { orderId },
            //         tool: { toolId: buyNowItem?.product?.toolId }
            //     }
            //     createOrderTool(newOrderItem);
            //     newOrderItem = {}
            //     navigate("/")
            //     toast.success("Thanh toán thành công");
            // }

            // // Mua trong gio hang
            // if (selectedItems?.length != 0) {
            //     // const checkoutItem = cartItems?.filter(item => selectedItems?.includes(item?.id));
            //     const checkoutItem = sellerGroup?.products;
            //     console.log("checkoutItem", checkoutItem);

            //     let newOrderItems = {};
            //     checkoutItem?.forEach((item) => {
            //         newOrderItems = {
            //             quantity: item?.quantity,
            //             order: { orderId },
            //             tool: { toolId: item?.toolId },
            //             name: item?.name,
            //             price: item?.price,
            //         }
            //         console.log("newOrderItems", newOrderItems);
            //         createOrderTool(newOrderItems);
            //         newOrderItems = {};
            //     });

            //     setCartItems((prevCartItems) => prevCartItems?.filter(item => !checkoutItem?.includes(item?.id)));
            //     selectedItems?.forEach(itemId => deleteCartTool(itemId));

            //     setCartQuantity(cartQuantity - selectedItems?.length);
            //     setSelectedItems([]);
            //     navigate("/");
            //     toast.success("Thanh toán thành công");
            // }
        }

    };

    return (
        <Layout className="min-h-screen bg-gradient-to-r from-indigo-100 to-purple-200 flex items-center justify-center">
            <Content className="w-[90%] p-4 ">
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
                />

            </Content>
        </Layout >
    );
};

export default CheckoutPage;
