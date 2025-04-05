import { EditOutlined } from "@ant-design/icons";
import { Button, Form, Select } from "antd";
import { useState } from "react";
import { useUpdateUserPatch } from "../../become-seller/hooks/useUpdateUserPatch";
import { useSelector } from "react-redux";
import { useAddressUser } from "../../../hooks/useAddressUser";
import ModalAddressForm from "../../checkout/Components/ModalAddressForm";
import { useCreateAddressUser } from "../../checkout/hooks/addresses/useCreateAddressUser";

const { Option } = Select;

const AddressManagement = () => {
    const [disabledAddress, setDisabledAddress] = useState(false);
    const [isUpdateAddress, setIsUpdateAddress] = useState(false);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const { createAddressUser } = useCreateAddressUser();

    const userId = useSelector((state) => state?.account?.user?.id);

    const { addresses } = useAddressUser(userId);

    const [form] = Form.useForm();

    const showAddAddressModal = () => {
        setIsModalVisible(true);
    };

    const updateAddress = () => {
        setDisabledAddress((prev) => !prev);
        setIsUpdateAddress((prev) => !prev);
    };

    const handleUpdateAddress = () => {
        setDisabledAddress((prev) => !prev);
        setIsUpdateAddress((prev) => !prev);
        // logic update address
        const shopAddressId = form.getFieldValue("shopAddressId");
        updateUser({ data: { shopAddressId }, userId });
    };

    const { updateUser } = useUpdateUserPatch();

    const handleAddNewAddress = (newAddress) => {
        createAddressUser({ ...newAddress, user: { userId } });
        setIsModalVisible(false);
    };

    return (
        <>
            <div className="flex items-center gap-2 mb-3">
                <Form.Item
                    label="Địa chỉ Shop"
                    name="shopAddressId"
                    rules={[
                        { required: true, message: "Vui lòng chọn địa chỉ cửa hàng!" },
                    ]}
                    className="flex-1 m-0"
                >
                    <Select
                        placeholder="Chọn địa chỉ lấy hàng"
                        className="rounded-md"
                        disabled={disabledAddress}
                        dropdownRender={(menu) => (
                            <>
                                {menu}
                                <Button
                                    type="link"
                                    onClick={showAddAddressModal}
                                    className="text-left text-blue-600"
                                >
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
                    <Button
                        loading=""
                        className="flex items-center justify-center mt-8"
                        onClick={handleUpdateAddress}
                    >
                        Lưu
                    </Button>
                )}

                <ModalAddressForm
                    isVisible={isModalVisible}
                    onOk={handleAddNewAddress}
                    onCancel={() => setIsModalVisible(false)}
                />
            </div>
        </>
    );
};

export default AddressManagement;
