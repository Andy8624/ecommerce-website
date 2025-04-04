import { Form, Button, Select } from 'antd';
import { useState } from 'react';
import ModalAddressForm from './ModalAddressForm';
import { useCreateAddressUser } from '../hooks/addresses/useCreateAddressUser';
import { AiFillEnvironment } from 'react-icons/ai';
import { CreditCardOutlined } from '@ant-design/icons';
const { Option } = Select;

const CheckoutForm = ({ userId, paymentMethodDB, addressUser, setSelectedAddress, setSelectedPaymentMethod }) => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleSelectAddress = (addressId) => {
        const selectedAddress = addressUser?.find((address) => address.addressId === addressId);
        setSelectedAddress(selectedAddress);
    };

    const handleSelectPaymentMethod = (value) => {
        const selectedPaymentMethod = paymentMethodDB?.find((method) => method.paymentMethodId === value);
        setSelectedPaymentMethod(selectedPaymentMethod);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const { createAddressUser } = useCreateAddressUser();

    const handleAddAddress = (newAddress) => {
        const address = {
            ...newAddress,
            user: {
                userId: userId,
            },
        };
        createAddressUser(address);
        setIsModalVisible(false);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    return (
        <>
            <Form
                form={form}
                layout="vertical"
                className="space-y-4 bg-white rounded-lg p-4 shadow-lg my-3"
            >
                <Form.Item
                    label={
                        <span className="text-[var(--primary-color)] flex text-xl align-center">
                            <span className="mt-1 me-2"><AiFillEnvironment /></span>
                            <span>Địa chỉ giao hàng</span>
                        </span>
                    }
                    name="shippingAddress"
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
                        defaultValue={addressUser && addressUser?.length > 0 ? addressUser[0]?.addressId : undefined}
                    >
                        {addressUser?.map((address) => (
                            <Option key={address?.addressId} value={address?.addressId}>
                                {`${address?.street}, ${address?.ward}, ${address?.district}, ${address?.city}`}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label={
                        <span className="text-[var(--primary-color)] flex text-xl align-center">
                            <span className="me-2"><CreditCardOutlined /></span>
                            <span>Phương thức thanh toán</span>
                        </span>
                    }
                    name="paymentMethod"
                >
                    <Select
                        placeholder="Chọn phương thức thanh toán"
                        className="rounded-md"
                        onChange={handleSelectPaymentMethod}
                        defaultValue={paymentMethodDB && paymentMethodDB?.length > 0 ? paymentMethodDB[0].paymentMethodId : undefined}
                    >
                        {paymentMethodDB?.map((method) => (
                            <Option key={method?.paymentMethodId} value={method?.paymentMethodId}>
                                {method?.name}
                            </Option>
                        ))}
                    </Select>
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