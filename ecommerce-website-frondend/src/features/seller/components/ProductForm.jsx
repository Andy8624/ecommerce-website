import { Modal, Form, Input, InputNumber, Select, Switch, Button, Upload, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useCreateToolType } from "../hooks/useCreateToolType";
import { useEffect, useState } from "react";
import { uploadFile } from "../../../services/FileService";
import { TOOL_URL } from "../../../utils/Config";

const ProductForm = ({ userId, visible, onCancel, onSubmit, editingTool, toolTypes, isToolTypesLoading }) => {
    const [form] = Form.useForm();
    const { createToolType, isLoading: isCreatingToolType } = useCreateToolType();
    const [isCreatingNewType, setIsCreatingNewType] = useState(false);
    const [imageFileName, setImageFileName] = useState(editingTool?.imageUrl || "");

    // Reset form fields khi mở hoặc đóng modal
    useEffect(() => {
        if (visible) {
            if (editingTool) {
                // Đặt giá trị khi đang chỉnh sửa
                form.setFieldsValue({
                    ...editingTool,
                    toolTypeId: editingTool?.toolType?.toolTypeId,
                });
                setImageFileName(editingTool.imageUrl || "default.png");
            } else {
                // Xóa toàn bộ giá trị khi form chuyển sang thêm mới
                form.resetFields();
                setImageFileName("");
                setIsCreatingNewType(false);
            }
        }
    }, [editingTool, form, visible]);

    const handleCreateOrUpdate = async (values) => {
        let toolTypeId = values.toolTypeId;
        if (isCreatingNewType && values.newToolType) {
            const response = await createToolType({ name: values.newToolType });
            toolTypeId = response?.toolTypeId;
        }

        const toolData = {
            ...values,
            imageUrl: imageFileName,
            toolType: { toolTypeId },
            user: { userId }
        };

        await onSubmit(toolData);
        form.resetFields();
        setIsCreatingNewType(false);
        setImageFileName("");
    };

    const toggleToolTypeInput = (checked) => {
        setIsCreatingNewType(checked);
        form.setFieldsValue({ newToolType: "" });
    };

    const handleImageUpload = async ({ file }) => {
        const fileName = await uploadFile(file, "tools");
        setImageFileName(fileName);
    };

    return (
        <Modal
            title={editingTool ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
            open={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form
                form={form}
                onFinish={handleCreateOrUpdate}
                layout="vertical"
                className="space-y-4"
            >
                <Form.Item
                    label="Tên sản phẩm"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                >
                    <Input.TextArea />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label="Giá"
                            name="price"
                            rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}
                        >
                            <InputNumber min={0} style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            label="Giá giảm"
                            name="discountedPrice"
                        >
                            <InputNumber min={0} style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            label="Số lượng"
                            name="stockQuantity"
                        >
                            <InputNumber min={0} style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Loại sản phẩm">
                    <Switch
                        checkedChildren="Tạo mới"
                        unCheckedChildren="Chọn có sẵn"
                        onChange={toggleToolTypeInput}
                    />
                    {isCreatingNewType ? (
                        <Form.Item
                            name="newToolType"
                            rules={[{ required: true, message: "Vui lòng nhập tên loại sản phẩm!" }]}
                        >
                            <Input placeholder="Nhập tên loại sản phẩm mới" />
                        </Form.Item>
                    ) : (
                        <Form.Item name="toolTypeId" rules={[{ required: true, message: "Vui lòng chọn loại sản phẩm!" }]}>
                            <Select loading={isToolTypesLoading} placeholder="Chọn loại sản phẩm">
                                {toolTypes?.map(type => (
                                    <Select.Option key={type.toolTypeId} value={type.toolTypeId}>
                                        {type.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}
                </Form.Item>

                <Form.Item label="Ảnh sản phẩm">
                    <Upload
                        customRequest={handleImageUpload}
                        showUploadList={false}
                        accept="image/*"
                    >
                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </Upload>
                    {imageFileName && <div><img className="w-20 h-20 object-cover mt-2" src={TOOL_URL + imageFileName} /></div>}
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isCreatingToolType}
                        className="w-full"
                    >
                        {editingTool ? "Cập nhật" : "Thêm"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ProductForm;
