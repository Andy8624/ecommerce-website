import { useState } from "react";
import { Form, Input, Button, Select, Divider, Typography } from "antd";
import { CreditCardOutlined, DollarOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useCreateOrder } from "../hooks/useCreateOrder";
import { useSelector } from "react-redux";
import { useAddressUser } from "../hooks/useAddressUser";
import { useCreateOrderCourse } from "../../seller/hooks/useCreateOrderCourse";

const { Title, Text } = Typography;
const { Option } = Select;

const OnlinePayment = () => {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState("creditCard");
    const marginTop = paymentMethod === "creditCard" ? "0" : "3.5rem";
    const userId = useSelector(state => state?.account?.user?.id);
    const location = useLocation()
    const { course } = location.state || {};
    const totalAmount = course?.discountedPrice || course?.price;

    const { addresses } = useAddressUser(userId)
    const addressId = addresses?.[0].addressId;

    const { createOrder } = useCreateOrder();
    const { createOrderCourse } = useCreateOrderCourse();
    const handlePaymentSubmit = async () => {
        const courseOrder = {
            status: "SUCCESS",
            shippingCost: 0,
            user: {
                userId
            },
            paymentMethod: {
                paymentMethodId: 1
            },
            address: {
                addressId
            },
            type: "COURSE",
        }
        const res = await createOrder(courseOrder)
        const orderId = res.orderId;
        const orderCourse = {
            order: {
                orderId
            },
            course: {
                courseId: course.courseId
            },
            quantity: 1,
        }
        await createOrderCourse(orderCourse)

        toast.success("Thanh toán thành công");
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md text-center"
            style={{ marginTop: `${marginTop}` }}
        >
            <Title level={3} className="text-blue-600">Thanh Toán</Title>
            <Divider />

            <Form layout="vertical" onFinish={handlePaymentSubmit}>
                <Form.Item label="Phương Thức Thanh Toán" name="paymentMethod" initialValue="creditCard">
                    <Select value={paymentMethod} onChange={setPaymentMethod}>
                        <Option value="creditCard">Thẻ Tín Dụng/Ghi Nợ</Option>
                        <Option value="paypal">PayPal</Option>
                    </Select>
                </Form.Item>


                {paymentMethod === "creditCard" && (
                    <>
                        <Form.Item
                            name="cardNumber"
                            label="Số Thẻ"
                        // rules={[
                        //     { required: true, message: "Vui lòng nhập số thẻ" },
                        //     // { min: 16, max: 16, message: "Số thẻ phải gồm 16 chữ số" },
                        // ]}
                        >
                            <Input placeholder="1234 5678 9012 3456" prefix={<CreditCardOutlined />} />
                        </Form.Item>
                        <Form.Item
                            name="cardHolder"
                            label="Tên Chủ Thẻ"
                        // rules={[{ required: true, message: "Vui lòng nhập tên chủ thẻ" }]}
                        >
                            <Input placeholder="Nguyen Van A" />
                        </Form.Item>
                        <Form.Item
                            name="expirationDate"
                            label="Ngày Hết Hạn"
                        // rules={[{ required: true, message: "Vui lòng nhập ngày hết hạn" }]}
                        >
                            <Input placeholder="MM/YY" />
                        </Form.Item>
                        <Form.Item
                            name="cvv"
                            label="CVV"
                            rules={[
                                // { required: true, message: "Vui lòng nhập CVV" },
                                // { len: 3, message: "CVV phải gồm 3 chữ số" },
                            ]}
                        >
                            <Input.Password placeholder="***" maxLength={3} />
                        </Form.Item>
                    </>
                )}


                {paymentMethod === "paypal" && (
                    <Text>Vui lòng đăng nhập vào tài khoản PayPal của bạn để hoàn tất thanh toán.</Text>
                )}

                <Divider />

                <div className="mb-4">
                    <Text strong className="text-xl">Tổng tiền: {totalAmount.toLocaleString()}đ</Text>
                </div>


                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<DollarOutlined />}
                        className="w-full"
                        onClick={() => navigate(-1)}
                    >
                        Thanh Toán
                    </Button>
                </Form.Item>
            </Form>
        </div >
    );
};

export default OnlinePayment;
