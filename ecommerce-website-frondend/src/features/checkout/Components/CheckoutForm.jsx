import { Form, Button, Select } from 'antd';
import { useState } from 'react';
import ModalAddressForm from './ModalAddressForm';
import { useCreateAddressUser } from '../hooks/useCreateAddressUser';

const { Option } = Select;

const CheckoutForm = ({ userId, paymentMethodDB, addressUser, onFinish, loading, setSelectedAddress, setPaymentMethod }) => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleSelectAddress = (value) => {
        setSelectedAddress(value); // Cập nhật địa chỉ đã chọn
    };

    const handleSelectPaymentMethod = (value) => {
        setPaymentMethod(value); // Cập nhật phương thức thanh toán đã chọn
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const { createAddressUser } = useCreateAddressUser();

    const handleAddAddress = (newAddress) => {
        const address = {
            ...newAddress,
            user: {
                userId: userId
            }
        }
        createAddressUser(address);
        setIsModalVisible(false);
    }

    return (
        <>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="space-y-4"
            >
                <Form.Item
                    label="Địa chỉ giao hàng"
                    name="shippingAddress"
                    rules={[{ required: true, message: 'Vui lòng chọn hoặc thêm địa chỉ' }]}
                >
                    <Select
                        placeholder="Chọn địa chỉ"
                        className="rounded-md"
                        onChange={handleSelectAddress}
                        dropdownRender={(menu) => (
                            <>
                                {menu}
                                <Button
                                    type="link"
                                    onClick={showModal}
                                    className="w-full text-left text-blue-600"
                                >
                                    + Thêm địa chỉ mới
                                </Button>
                            </>
                        )}
                    >
                        {addressUser?.map((address) => (
                            <Option key={address.addressId} value={address.addressId}>
                                {`${address.street}, ${address.ward}, ${address.district}, ${address.city}`}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Phương thức thanh toán"
                    name="paymentMethod"
                    rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán' }]}
                >
                    <Select
                        placeholder="Chọn phương thức thanh toán"
                        className="rounded-md"
                        onChange={handleSelectPaymentMethod}
                    >
                        {paymentMethodDB?.map((method) => (
                            <Option key={method.paymentMethodId} value={method.paymentMethodId}>
                                {method.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="w-full rounded-lg py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md"
                    >
                        Xác nhận thanh toán
                    </Button>
                </Form.Item>
            </Form>

            <ModalAddressForm
                isVisible={isModalVisible}
                onOk={handleAddAddress}
                onCancel={handleCancel}
            />
        </>
    );
};

export default CheckoutForm;
