import { Button, Form, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetUserById } from '../../../hooks/useGetUserById';
import { useAddressUser } from '../../../hooks/useAddressUser';
import { useCreateAddressUser } from '../../checkout/hooks/addresses/useCreateAddressUser';
import ModalAddressForm from '../../checkout/Components/ModalAddressForm';
import { useQueryClient } from '@tanstack/react-query';
import { callCheckPhoneExist, callCheckShopName } from '../../../services/UserService';
import { useCreateShopInfo } from '../hooks/useCreateShopInfo';
import { toast } from 'react-toastify';
import { EditOutlined } from '@ant-design/icons';
import { useUpdateUserPatch } from '../hooks/useUpdateUserPatch';

const { Option } = Select;

const ShopInfoForm = ({ next }) => {
    const queryClient = useQueryClient()
    const userId = useSelector(state => state.account?.user?.id);

    const [disabled, setDisabled] = useState(false);
    const [disabledShopName, setDisabledShopName] = useState(false);
    const [disabledAddress, setDisabledAddress] = useState(false);
    const [disabledPhone, setDisabledPhone] = useState(false);

    const [isUpdateShopName, setIsUpdateShopName] = useState(false);
    const [isUpdateAddress, setIsUpdateAddress] = useState(false);
    const [isUpdatePhone, setIsUpdatePhone] = useState(false);


    // Hooks for data fetching
    const { getUserById } = useGetUserById(userId);
    const { addresses } = useAddressUser(userId);
    const { createAddressUser } = useCreateAddressUser();

    // Modal visibility and form instance
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    // Set default form values when data is available
    useEffect(() => {
        if (getUserById && addresses?.length > 0) {
            form.setFieldsValue({
                shopName: getUserById?.shopName || '',
                shopAddressId: getUserById?.shopAddressId || null,
                email: getUserById?.email,
                phone: getUserById?.phone || '',
            });
        }
        if (getUserById?.shopName) {
            setDisabledShopName(true);
        }
        if (getUserById?.phone) {
            setDisabledPhone(true);
        }
        if (getUserById?.shopAddressId) {
            setDisabledAddress(true);
        }
    }, [getUserById, addresses, form]);

    const { createShopInfo, isCreatingShop } = useCreateShopInfo();
    const { updateUser } = useUpdateUserPatch();

    // Handle form submission
    const handleSubmit = async (values) => {
        await createShopInfo(
            { ...values },
            {
                onSuccess: () => {
                    setDisabled(true);
                    setDisabledShopName(true);
                    setDisabledAddress(true);
                    setDisabledPhone(true);
                    queryClient.invalidateQueries(["users", userId]);
                    toast.success('Thông tin Shop đã được cập nhật!');
                },
                onError: (error) => {
                    console.error('Error submitting form:', error);
                }
            });
    };

    // Handle failed form submission
    const handleError = (errorInfo) => {
        console.log('Form submission failed:', errorInfo);
        // Handle form errors if needed
    };

    // Validate form and proceed to the next step
    const handleNextStep = () => {
        form.validateFields()
            .then(() => {
                next();
            })
            .catch(errorInfo => {
                console.log('Form validation failed:', errorInfo);
            });
    };

    // Open modal for adding a new address
    const showAddAddressModal = () => {
        setIsModalVisible(true);
    };

    // Handle adding a new address
    const handleAddNewAddress = (newAddress) => {
        createAddressUser({ ...newAddress, user: { userId } });
        setIsModalVisible(false);
    };

    const validatePhone = async (_, value) => {
        if (!value) return Promise.reject('Vui lòng nhập số điện thoại!');

        // Kiểm tra định dạng số điện thoại (ví dụ: chỉ cho phép số điện thoại có 10 chữ số bắt đầu bằng 0)
        const phoneRegex = /^(0[3|5|7|8|9]{1})[0-9]{8}$/;
        if (!phoneRegex.test(value)) {
            return Promise.reject('Số điện thoại không hợp lệ!');
        }

        // Sử dụng React Query để kiểm tra số điện thoại có tồn tại hay không
        const { data } = await queryClient.fetchQuery({
            queryKey: ['checkPhone', value],
            queryFn: () => callCheckPhoneExist(value, userId),
        });

        if (data) {
            return Promise.reject('Số điện thoại đã tồn tại!');
        }

        return Promise.resolve();
    };


    const validateShopName = async (_, value) => {
        if (!value) return Promise.reject('Vui lòng nhập tên Shop!');
        try {
            const { data } = await queryClient.fetchQuery({
                queryKey: ['checkShopName', value],
                queryFn: () => callCheckShopName(value),
            });

            return data ? Promise.reject('Tên Shop đã tồn tại!') : Promise.resolve();
        } catch (error) {
            console.error('Error checking phone number:', error);
            return Promise.reject('Lỗi kiểm tra tên Shop!');
        }
    };


    const updateShopName = () => {
        setDisabledShopName(prev => !prev);
        setIsUpdateShopName(prev => !prev);
    }

    const handleUpdateShopName = () => {
        setDisabledShopName(prev => !prev);
        setIsUpdateShopName(prev => !prev);
        // logic update shop name
        const shopName = form.getFieldValue('shopName');
        updateUser({ data: { shopName }, userId });
    }

    const updateAddress = () => {
        setDisabledAddress(prev => !prev);
        setIsUpdateAddress(prev => !prev);
    }

    const handleUpdateAddress = () => {
        setDisabledAddress(prev => !prev);
        setIsUpdateAddress(prev => !prev);
        // logic update address
        const shopAddressId = form.getFieldValue('shopAddressId');
        updateUser({ data: { shopAddressId }, userId });
    }

    const updatePhone = () => {
        setDisabledPhone(prev => !prev);
        setIsUpdatePhone(prev => !prev);
    }

    const handleUpdatePhone = () => {
        setDisabledPhone(prev => !prev);
        setIsUpdatePhone(prev => !prev);
        // logic update phone
        const phone = form.getFieldValue('phone');
        updateUser({ data: { phone }, userId });
    }


    return (
        <Form
            form={form}
            layout="vertical"
            className="w-[40%] mx-auto"
            onFinish={handleSubmit}
            onFinishFailed={handleError}
        >
            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: 'Vui lòng nhập địa chỉ email!' },
                    { type: 'email', message: 'Email không hợp lệ!' },
                ]}
                className="mb-3"
            >
                <Input disabled={true}
                    type="email" placeholder="Nhập địa chỉ email" />
            </Form.Item>

            <div className="flex items-center gap-2 mb-3">
                <Form.Item
                    label="Tên Shop"
                    name="shopName"
                    rules={[{ validator: validateShopName }]}
                    required
                    className="flex-1 m-0"
                >
                    <Input
                        placeholder="Nhập tên Shop"
                        maxLength={30}
                        disabled={disabledShopName}
                    />
                </Form.Item>
                {disabledShopName && (
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        className="flex items-center justify-center mt-8"
                        onClick={updateShopName}
                    />
                )}
                {isUpdateShopName && (
                    <Button loading="" className="flex items-center justify-center mt-8"
                        onClick={handleUpdateShopName}
                    >
                        Lưu
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-2 mb-3">
                <Form.Item
                    label="Địa chỉ Shop"
                    name="shopAddressId"
                    rules={[{ required: true, message: 'Vui lòng chọn địa chỉ cửa hàng!' }]}
                    className="flex-1 m-0"
                >
                    <Select
                        placeholder="Chọn địa chỉ lấy hàng"
                        className="rounded-md"
                        disabled={disabledAddress}
                        dropdownRender={(menu) => (
                            <>
                                {menu}
                                <Button type="link" onClick={showAddAddressModal} className="text-left text-blue-600">
                                    + Thêm địa chỉ mới
                                </Button>
                            </>
                        )}
                    >
                        {addresses?.map(({ addressId, street, ward, district, city }) => (
                            <Option key={addressId} value={addressId}>
                                {`${street}, ${ward}, ${district}, ${city}`}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                {disabledAddress && (
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        className="flex items-center justify-center mt-8"
                        onClick={updateAddress}
                    />
                )}
                {isUpdateAddress && (
                    <Button loading="" className="flex items-center justify-center mt-8"
                        onClick={handleUpdateAddress}
                    >
                        Lưu
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-2 mb-3">

                <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                        { validator: validatePhone },
                    ]}
                    required
                    className="flex-1 m-0"
                >
                    <Input
                        placeholder="Nhập số điện thoại"
                        disabled={disabledPhone}
                    />
                </Form.Item>
                {disabledPhone && (
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        className="flex items-center justify-center mt-8"
                        onClick={updatePhone}
                    />
                )}
                {isUpdatePhone && (
                    <Button loading="" className="flex items-center justify-center mt-8"
                        onClick={handleUpdatePhone}
                    >
                        Lưu
                    </Button>
                )}
            </div>

            <div className="flex justify-end gap-2">
                <Button
                    htmlType="submit"
                    loading={isCreatingShop}
                    hidden={disabled || disabledShopName || disabledAddress || disabledPhone}
                >
                    Lưu
                </Button>
                <Button type="primary" onClick={handleNextStep}>Tiếp theo</Button>
            </div>

            <ModalAddressForm
                isVisible={isModalVisible}
                onOk={handleAddNewAddress}
                onCancel={() => setIsModalVisible(false)}
            />
        </Form>
    );
};

export default ShopInfoForm;
