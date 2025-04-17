import { Form, Input, Button } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    LockOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';

const RegisterForm = ({ onFinish, isSubmitting }) => {
    // Hàm kiểm tra mật khẩu mạnh
    const validatePassword = (_, value) => {
        if (!value) {
            return Promise.reject(new Error('Vui lòng nhập mật khẩu!'));
        }

        if (value.length < 6) {
            return Promise.reject(new Error('Mật khẩu phải có ít nhất 6 ký tự!'));
        }

        // Kiểm tra mật khẩu có ít nhất 1 chữ hoa, 1 chữ thường và 1 số
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumbers = /\d/.test(value);

        if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
            return Promise.reject(
                new Error('Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số!')
            );
        }

        return Promise.resolve();
    };

    return (
        <Form
            name="register"
            onFinish={onFinish}
            className="auth-form mt-[50px]"
            layout="vertical"
        >
            <h1 className='font-bold text-2xl mb-2'>Đăng ký</h1>
            <Form.Item
                name="fullName"
                className="w-full mb-2"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                tooltip="Tên của bạn sẽ hiển thị trong tài khoản"
            >
                <Input
                    prefix={<UserOutlined className="site-form-item-icon mr-2" />}
                    placeholder="Họ tên"
                    className="h-10 rounded-md input-with-centered-prefix"
                />
            </Form.Item>

            <Form.Item
                name="email"
                className="w-full mb-2"
                rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                ]}
                tooltip="Email này sẽ được sử dụng để đăng nhập và nhận thông báo"
            >
                <Input
                    prefix={<MailOutlined className="site-form-item-icon mr-2" />}
                    placeholder="Email"
                    className="h-10 rounded-md input-with-centered-prefix"
                />
            </Form.Item>

            <Form.Item
                name="password"
                className="w-full mb-2"
                rules={[{ validator: validatePassword }]}
                tooltip={{
                    title: 'Mật khẩu phải có ít nhất 6 ký tự, 1 chữ hoa, 1 chữ thường và 1 số',
                    icon: <InfoCircleOutlined />
                }}
            >
                <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon mr-2" />}
                    placeholder="Mật khẩu"
                    className="h-10 rounded-md input-with-centered-prefix"
                />
            </Form.Item>

            <Form.Item
                name="confirmPassword"
                className="w-full mb-2"
                dependencies={['password']}
                rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                        },
                    }),
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon mr-2" />}
                    placeholder="Xác nhận mật khẩu"
                    className="h-10 rounded-md input-with-centered-prefix"
                />
            </Form.Item>

            <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                className="auth-button w-full h-10 mt-2"
            >
                Đăng ký
            </Button>
        </Form>
    );
};

export default RegisterForm;