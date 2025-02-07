import { InfoCircleFilled } from '@ant-design/icons';
import { Form, Input, Radio, Select, Button } from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAddressUser } from '../../../hooks/useAddressUser';
import ModalAddressForm from '../../checkout/Components/ModalAddressForm';
import { useCreateAddressUser } from '../../checkout/hooks/addresses/useCreateAddressUser';
import { toast } from 'react-toastify';

const { Option } = Select;

const TaxAndIdentityInfo = ({ next, prev }) => {
    const [form] = Form.useForm();
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const userId = useSelector(state => state.account?.user?.id);
    const { addresses } = useAddressUser(userId);
    const { createAddressUser } = useCreateAddressUser();

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

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            console.log('Dữ liệu đã lưu:', values);
            toast.success('Lưu thông tin thành công!');
        } catch (error) {
            toast.error('Vui lòng điền đầy đủ thông tin trước khi lưu.', error);
        }
    };

    const handleNext = async () => {
        try {
            const values = await form.validateFields();
            console.log('Dữ liệu form:', values);
            toast.success('Lưu thông tin thành công!');
            next();
        } catch (error) {
            toast.error('Vui lòng điền đầy đủ thông tin trước khi tiếp tục.', error);
        }
    };

    return (
        <Form
            layout="vertical"
            form={form}
            className="w-[60%] mx-auto"
            initialValues={{
                businessType: 'individual',
                taxCode: '',
                emails: [''],
            }}
        >
            <p className="mb-2 border border-blue-500 bg-blue-100 p-4 rounded-md text-gray-500">
                <InfoCircleFilled className="text-blue-500" /> Việc thu thập Thông Tin Thuế và Thông Tin Định Danh là bắt buộc theo quy định của Luật an ninh mạng, Thương mại điện tử và Thuế của Việt Nam.
                Thông tin này sẽ được bảo vệ theo chính sách bảo mật của EduMall.
            </p>

            <Form.Item label="Loại hình kinh doanh" name="businessType" required>
                <Radio.Group onChange={handleBusinessTypeChange}>
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
                    { type: "email", message: "Email không hợp lệ!" }
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
                >
                    {addresses?.map((address) => (
                        <Option key={address.addressId} value={address.addressId}>
                            {`${address.street}, ${address.ward}, ${address.district}, ${address.city}`}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Email nhận hóa đơn điện tử"
                name="email"
                rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" }
                ]}
                style={{ marginBottom: "0.2rem" }}
            >
                <Input placeholder="Nhập email" />
            </Form.Item>
            <p className="mb-3 ms-2 text-gray-500">Hóa đơn điện tử của bạn sẽ được gửi đến địa chỉ email này</p>


            <Form.Item label="Mã số thuế" name="taxCode" required
                style={{ marginBottom: "0.2rem" }}
            >
                <Input placeholder="Nhập mã số thuế" />
            </Form.Item>
            <p className="mb-3 ms-2 text-gray-500">
                Theo Nghị định 52/2013/ND-CP, Người Bán phải cung cấp thông tin Mã số thuế cho sàn Thương mại điện tử.
            </p>

            <div className="flex justify-between mt-3">
                <Button onClick={prev}>Quay lại</Button>
                <div className="flex gap-2">
                    <Button onClick={handleSave} type="default">
                        Lưu
                    </Button>
                    <Button type="primary" onClick={handleNext}>
                        Tiếp theo
                    </Button>
                </div>
            </div>

            <ModalAddressForm isVisible={isModalVisible} onOk={handleAddAddress} onCancel={handleCancel} />
        </Form>
    );
};

export default TaxAndIdentityInfo;
