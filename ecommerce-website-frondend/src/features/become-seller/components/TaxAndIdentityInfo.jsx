import { InfoCircleFilled, DeleteOutlined } from '@ant-design/icons';
import { Form, Input, Radio, Select, Button, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';
import ModalAddressForm from '../../checkout/Components/ModalAddressForm';
import { useCreateAddressUser } from '../../checkout/hooks/addresses/useCreateAddressUser';
import { toast } from 'react-toastify';
import { useUpdateTaxAndIdentityInfo } from '../hooks/useTaxAndIdentityInfo';
import { useUpdateUserRoleByUserId } from '../../auth/hooks/useUpdateUserRoleByUserId';
import { useQueryClient } from '@tanstack/react-query';
import { useDeleteAddressUser } from '../../checkout/hooks/addresses/useDeleteAddressUser';

const { Option } = Select;

const TaxAndIdentityInfo = ({ next, prev, addresses, userId, getUserById }) => {
    const [form] = Form.useForm();
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const { updateTaxAndIdentityInfo } = useUpdateTaxAndIdentityInfo();
    const { createAddressUser } = useCreateAddressUser();
    const queryClient = useQueryClient();
    const { deleteAddressUser, isDeleting } = useDeleteAddressUser();

    useEffect(() => {
        if (getUserById && addresses?.length > 0) {
            form.setFieldsValue({
                businessType: getUserById?.businessType || "individual",
                businessAddress: getUserById?.businessAddress || null,
                billingEmail: getUserById?.billingEmail || '',
                taxNumber: getUserById?.taxNumber || '',
            });
        }
        if (getUserById?.taxNumber && getUserById?.billingEmail && getUserById?.businessAddress && getUserById?.businessType) {
            setDisabled(true);
        }
    }, [getUserById, addresses, form]);

    const handleBusinessTypeChange = (e) => {
        console.log('Loại hình kinh doanh:', e.target.value);
    };

    const handleSelectAddress = (value) => {
        setSelectedAddress(value);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleAddAddress = (newAddress) => {
        createAddressUser({
            ...newAddress,
            user: { userId },
        });
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleDeleteAddress = (addressId, e) => {
        e.stopPropagation();
        deleteAddressUser(addressId, {
            onSuccess: () => {
                queryClient.invalidateQueries(["addresses", userId]);
                toast.success('Địa chỉ đã được xóa thành công!');
            },
            onError: (error) => {
                console.error('Error deleting address:', error);
                toast.error('Không thể xóa địa chỉ. Vui lòng thử lại!');
            }
        });
    };

    const { updateUserRole } = useUpdateUserRoleByUserId();
    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            await updateTaxAndIdentityInfo({ data: values, userId });
            // update role
            await updateUserRole({
                userId, data: {
                    role: {
                        roleId: 2
                    }
                }
            });

            setDisabled(true);
        } catch (error) {
            console.log('Lỗi:', error);
            toast.error('Vui lòng điền đầy đủ thông tin!');
        }
    };

    const handleNext = async () => {
        if (disabled) {
            next();
        } else {
            await handleSave();
            next();
        }
    };

    return (
        <Form
            layout="vertical"
            form={form}
            className="w-[60%] mx-auto"
        >
            <p className="mb-2 border border-blue-500 bg-blue-100 p-4 rounded-md text-gray-500">
                <InfoCircleFilled className="text-blue-500" /> Việc thu thập Thông Tin Thuế và Thông Tin Định Danh là bắt buộc theo quy định của Luật an ninh mạng, Thương mại điện tử và Thuế của Việt Nam.
                Thông tin này sẽ được bảo vệ theo chính sách bảo mật của EduMall.
            </p>

            <Form.Item label="Loại hình kinh doanh" name="businessType" required className="mb-3">
                <Radio.Group onChange={handleBusinessTypeChange} disabled={disabled}>
                    <Radio value="individual">Cá nhân</Radio>
                    <Radio value="household">Hộ kinh doanh</Radio>
                    <Radio value="company">Công ty</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item
                label="Địa chỉ đăng ký kinh doanh"
                name="businessAddress"
                rules={[
                    { required: true, message: "Vui lòng chọn địa chỉ kinh doanh" },
                ]}
            >
                <Select
                    placeholder="Chọn địa chỉ"
                    className="rounded-md"
                    onChange={handleSelectAddress}
                    value={selectedAddress}
                    dropdownRender={(menu) => (
                        <>
                            {menu}
                            <Button type="link" onClick={showModal} className="w-full text-left text-blue-600">
                                + Thêm địa chỉ mới
                            </Button>
                        </>
                    )}
                    disabled={disabled}
                >
                    {addresses?.map((address) => (
                        <Option key={address.addressId} value={address.addressId}>
                            <div className="flex justify-between items-center">
                                <span>{`${address.street}, ${address.ward}, ${address.district}, ${address.city}`}</span>
                                <Popconfirm
                                    title="Xóa địa chỉ này?"
                                    description="Bạn chắc chắn muốn xóa địa chỉ này?"
                                    onConfirm={(e) => handleDeleteAddress(address.addressId, e)}
                                    okText="Xóa"
                                    cancelText="Hủy"
                                >
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        className="flex items-center justify-center"
                                        onClick={(e) => e.stopPropagation()}
                                        disabled={disabled || isDeleting}
                                    />
                                </Popconfirm>
                            </div>
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Email nhận hóa đơn điện tử"
                name="billingEmail"
                rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" }
                ]}
                style={{ marginBottom: "0.2rem" }}
            >
                <Input placeholder="Nhập email" disabled={disabled}
                />
            </Form.Item>
            <p className="mb-3 ms-2 text-gray-500">Hóa đơn điện tử của bạn sẽ được gửi đến địa chỉ email này</p>


            <Form.Item label="Mã số thuế" name="taxNumber" required
                style={{ marginBottom: "0.2rem" }}
                rules={[
                    { required: true, message: "Vui lòng nhập mã số thuế!" },
                ]}
            >
                <Input placeholder="Nhập mã số thuế" disabled={disabled} />
            </Form.Item>
            <p className="mb-3 ms-2 text-gray-500">
                Theo Nghị định 52/2013/ND-CP, Người Bán phải cung cấp thông tin Mã số thuế cho sàn Thương mại điện tử.
            </p>

            <div className="flex justify-between mt-3">
                <Button onClick={prev}>Quay lại</Button>
                <div className="flex gap-2">
                    {!disabled ?
                        <Button onClick={handleSave} type="default">
                            Lưu
                        </Button>
                        :
                        <Button type="default" onClick={() => setDisabled(prev => !prev)}>
                            Chỉnh sửa
                        </Button>
                    }
                    <Button type="primary" onClick={handleNext}>
                        Hoàn tất
                    </Button>
                </div>
            </div>

            <ModalAddressForm
                isVisible={isModalVisible}
                onOk={handleAddAddress}
                onCancel={handleCancel}
            />

        </Form>
    );
};

export default TaxAndIdentityInfo;
