import { Modal, Form, Input, InputNumber, Button } from "antd";
import { useEffect } from "react";

const Form = ({ userId, visible, onCancel, onSubmit, editing, isCreating }) => {
    const [form] = Form.useForm();
    useEffect(() => {
        if (visible) {
            if (editing) {
                form.setFieldsValue(editing);
            } else {
                form.resetFields();
            }
        }
    }, [editing, form, visible]);

    const handleCreateOrUpdate = async (values) => {

        if (editing !== null) {
            const DataUpdate = {
                ...values,
                userId: userId,
                Id: editing.Id || null,
            };
            await onSubmit(DataUpdate);
        } else {
            const DataCreate = {
                ...values,
                userId: userId,
            }
            await onSubmit(DataCreate);
        }
        form.resetFields();
    };

    return (
        <Modal
            title={editing ? "Cập nhật khóa học" : "Thêm khóa học"}
            open={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form
                form={form}
                onFinish={handleCreateOrUpdate}
                layout="vertical"
            >
                <Form.Item
                    label="URL playlist youtube"
                    name="Url"
                    rules={[{ required: true, message: "Vui lòng nhập URL khóa học!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Giá"
                    name="price"
                    rules={[{ required: true, message: "Vui lòng nhập giá khóa học!" }]}
                >
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Giá khuyến mãi"
                    name="discountedPrice"
                >
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full" disabled={isCreating}>
                        {isCreating && "Đang tiến hành "}
                        {editing ? "Cập nhật" : "Thêm"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default Form;
