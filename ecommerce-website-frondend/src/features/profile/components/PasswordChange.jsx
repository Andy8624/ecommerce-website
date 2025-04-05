import { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { LockOutlined, CheckCircleOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

const PasswordChange = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            setSuccess(false);

            // Replace with your actual API endpoint
            await axios.post("/api/auth/change-password", {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            });

            message.success("Mật khẩu của bạn đã được cập nhật thành công!");
            setSuccess(true);
            form.resetFields();
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                "Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại sau.";

            message.error(errorMessage);

            if (error.response?.status === 401) {
                form.setFields([
                    {
                        name: "currentPassword",
                        errors: ["Mật khẩu hiện tại không chính xác"],
                    },
                ]);
            }
        } finally {
            setLoading(false);
        }
    };

    // Password validation rules
    const validatePasswordMatch = ({ getFieldValue }) => ({
        validator(_, value) {
            if (!value || getFieldValue("newPassword") === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
        },
    });

    const validatePassword = (_, value) => {
        // If the value is empty, don't validate here (the required rule will handle it)
        if (!value) {
            return Promise.resolve();
        }

        if (value.length < 8) {
            return Promise.reject(new Error("Mật khẩu phải có ít nhất 8 ký tự"));
        }

        if (!/[A-Z]/.test(value)) {
            return Promise.reject(
                new Error("Mật khẩu phải có ít nhất 1 chữ cái viết hoa")
            );
        }

        if (!/[a-z]/.test(value)) {
            return Promise.reject(
                new Error("Mật khẩu phải có ít nhất 1 chữ cái viết thường")
            );
        }

        if (!/[0-9]/.test(value)) {
            return Promise.reject(new Error("Mật khẩu phải có ít nhất 1 số"));
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            return Promise.reject(
                new Error("Mật khẩu phải có ít nhất 1 ký tự đặc biệt")
            );
        }

        return Promise.resolve();
    };

    return (
        <div className="mx-auto">
            {/* Header */}
            <Title level={3}>
                Đổi Mật Khẩu
            </Title>

            <p style={{ marginBottom: "30px", color: "#888" }}>Lưu ý: Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ
                thường, số và ký tự đặc biệt.</p>

            {success && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md flex items-center">
                    <CheckCircleOutlined className="mr-2 text-xl" />
                    <Text className="text-green-700">
                        Mật khẩu đã được cập nhật thành công!
                    </Text>
                </div>
            )}

            <Form
                form={form}
                name="passwordChange"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
                requiredMark={false}
            >
                <Form.Item
                    name="currentPassword"
                    label="Mật khẩu hiện tại"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập mật khẩu hiện tại",
                        },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        placeholder="Nhập mật khẩu hiện tại"
                    />
                </Form.Item>

                <Form.Item
                    name="newPassword"
                    label="Mật khẩu mới"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập mật khẩu mới",
                        },
                        {
                            validator: validatePassword,
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        placeholder="Nhập mật khẩu mới"
                    />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Xác nhận mật khẩu mới"
                    dependencies={["newPassword"]}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng xác nhận mật khẩu mới",
                        },
                        validatePasswordMatch,
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        placeholder="Xác nhận mật khẩu mới"
                    />
                </Form.Item>

                <Form.Item className="mt-6">
                    <Button
                        type="primary font-bold text-[var(--gold-light)] bg-[var(--primary-color)]"
                        htmlType="submit"
                        loading={loading}
                        block
                        className="h-10"
                    >
                        Cập nhật mật khẩu
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default PasswordChange;
