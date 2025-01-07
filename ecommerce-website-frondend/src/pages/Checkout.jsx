import { useEffect, useState } from 'react';
import { Layout, Card, Typography } from 'antd';
import { useCartContext } from '../components/CartProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import useDeleteCartTool from '../features/cart/hooks/useDeleteCartTool';
import CheckoutSummary from '../features/checkout/Components/CheckoutSummary';
import CheckoutForm from '../features/checkout/Components/CheckoutForm';
import { useCreateOrder } from '../features/checkout/hooks/useCreateOrder';
import { useSelector } from 'react-redux';
import { useAddressUser } from '../features/checkout/hooks/useAddressUser';
import { useGetAllPaymentMethod } from '../features/checkout/hooks/usePaymentMethod';
import { useCreateOrderTool } from '../features/checkout/hooks/useCreateOrderTool';
import { toast } from 'react-toastify';

const { Title } = Typography;
const { Content } = Layout;

const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const buyNowItem = location.state?.buyNowItem;

    const {
        cartItems, setCartItems,
        selectedItems, setSelectedItems,
        cartQuantity, setCartQuantity
    } = useCartContext();

    const [isBuyNow, setIsBuyNow] = useState(false);

    useEffect(() => {
        if (selectedItems.length == 0) {
            setIsBuyNow(true);
        }
    }, [selectedItems]);

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const { paymentMethods: paymentMethodDB } = useGetAllPaymentMethod();

    const userId = useSelector(state => state?.account?.user?.id);

    const { addresses } = useAddressUser(userId);
    const [addressUser, setAddressUser] = useState(addresses);
    useEffect(() => {
        setAddressUser(addresses);
    }, [addresses]);

    const totalAmount =
        isBuyNow ?
            (buyNowItem.quantity * (buyNowItem.product.discountedPrice || buyNowItem.product.price))
            : (cartItems?.reduce((total, item) =>
                selectedItems.includes(item.id) ?
                    total + (item.discountPrice || item.price) * item.quantity :
                    total
                , 0));

    const shipCost = totalAmount * 0.05;

    const { deleteCartTool } = useDeleteCartTool();

    const { createOrder } = useCreateOrder();

    const { createOrderTool, isCreating } = useCreateOrderTool();

    const handleCheckout = async () => {
        const order = {
            status: "pending",
            shippingCost: shipCost,
            user: {
                userId: userId
            },
            paymentMethod: {
                paymentMethodId: paymentMethod
            },
            address: {
                addressId: selectedAddress
            },
            type: "PRODUCT"
        }
        const data = await createOrder(order);
        const orderId = data?.orderId;
        if (selectedItems.length == 0) {
            let newOrderItem = {
                quantity: buyNowItem.quantity,
                order: { orderId },
                tool: { toolId: buyNowItem.product.toolId }
            }
            createOrderTool(newOrderItem);
            newOrderItem = {}
            navigate(-1)
            toast.success("Thanh toán thành công");
        }

        if (selectedItems.length != 0) {
            const checkoutItem = cartItems.filter(item => selectedItems.includes(item.id));

            let newOrderItems = {};
            checkoutItem.forEach((item) => {
                newOrderItems = {
                    quantity: item.quantity,
                    order: { orderId },
                    tool: { toolId: item.toolId },
                }
                createOrderTool(newOrderItems);
                newOrderItems = {};
            });

            setCartItems((prevCartItems) => prevCartItems.filter(item => !checkoutItem.includes(item.id)));
            selectedItems.forEach(itemId => deleteCartTool(itemId));

            setCartQuantity(cartQuantity - selectedItems.length);
            setSelectedItems([]);
            navigate(-1);
            toast.success("Thanh toán thành công");
        }
    };

    return (
        <Layout className="min-h-screen bg-gradient-to-r from-indigo-100 to-purple-200 flex items-center justify-center">
            <Content className="w-full max-w-lg p-4 md:p-8">
                <Card className="rounded-xl shadow-xl overflow-hidden">
                    <Title level={3} className="text-center text-purple-700">Thanh toán</Title>

                    <CheckoutSummary
                        totalAmount={totalAmount}
                        shipCost={shipCost}
                    />

                    <CheckoutForm
                        addressUser={addressUser}
                        onFinish={handleCheckout}
                        loading={isCreating}
                        setSelectedAddress={setSelectedAddress}
                        setPaymentMethod={setPaymentMethod}
                        paymentMethodDB={paymentMethodDB}
                        userId={userId}
                    />
                </Card>
            </Content>
        </Layout>
    );
};

export default CheckoutPage;
