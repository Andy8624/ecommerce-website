import { Modal, Form, Input, InputNumber, Button } from "antd";
import { useEffect } from "react";

const CourseForm = ({ userId, visible, onCancel, onSubmit, editingCourse, isCreatingCourse }) => {
    const [form] = Form.useForm();
    useEffect(() => {
        if (visible) {
            if (editingCourse) {
                form.setFieldsValue(editingCourse);
            } else {
                form.resetFields();
            }
        }
    }, [editingCourse, form, visible]);

    const handleCreateOrUpdate = async (values) => {

        if (editingCourse !== null) {
            const courseDataUpdate = {
                ...values,
                userId: userId,
                courseId: editingCourse.courseId || null,
            };
            await onSubmit(courseDataUpdate);
        } else {
            const courseDataCreate = {
                ...values,
                userId: userId,
            }
            await onSubmit(courseDataCreate);
        }
        form.resetFields();
    };

    return (
        <Modal
            title={editingCourse ? "Cập nhật khóa học" : "Thêm khóa học"}
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
                    name="courseUrl"
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
                    <Button type="primary" htmlType="submit" className="w-full" disabled={isCreatingCourse}>
                        {isCreatingCourse && "Đang tiến hành "}
                        {editingCourse ? "Cập nhật" : "Thêm"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CourseForm;
