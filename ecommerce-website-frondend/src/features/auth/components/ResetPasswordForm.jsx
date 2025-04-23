import { Form, Input, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const ResetPasswordForm = ({ onFinish, isSubmitting, onBack }) => {
    const [form] = Form.useForm();

    const validatePasswordMatch = ({ getFieldValue }) => ({
        validator(_, value) {
            if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('Xác nhận mật khẩu không khớp!'));
        },
    });

    return (
        <div className="w-full p-[5rem]">
            {/* Tiêu đề */}
            <h4 className="text-2xl font-semibold mb-1 text-center">Đặt lại mật khẩu</h4>
            <p className="text-gray-500 mb-6 text-center">
                Vui lòng nhập mật khẩu mới cho tài khoản của bạn
            </p>

            <Form
                name="reset_password_form"
                form={form}
                onFinish={onFinish}
                layout="vertical"
                autoComplete="off"
                className="w-full"
            >
                <Form.Item
                    name="newPassword"
                    className="w-full mb-3"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                        {
                            pattern: /^(?=.*[a-z])(?=.*[A-Z])/,
                            message: 'Mật khẩu phải chứa ít nhất một chữ hoa và một chữ thường!'
                        }
                    ]}
                >
                    <Input
                        type="password"
                        placeholder="Mật khẩu mới"
                        className="h-10 rounded-md"
                    />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    className="w-full mb-6"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                        validatePasswordMatch
                    ]}
                >
                    <Input
                        type="password"
                        placeholder="Xác nhận mật khẩu mới"
                        className="h-10 rounded-md"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isSubmitting}
                        className="auth-button w-full h-10"
                    >
                        Đặt lại mật khẩu
                    </Button>
                </Form.Item>

                <div className="w-[50%] text-center mx-auto">

                    <Button
                        type="link"
                        icon={<ArrowLeftOutlined />}
                        onClick={onBack}
                        className="mx-auto"
                    >
                        Quay lại
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default ResetPasswordForm;