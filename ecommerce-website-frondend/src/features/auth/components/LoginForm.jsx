import { Form, Input, Button } from 'antd';
import {
    MailOutlined,
    LockOutlined,
    FacebookFilled,
    GoogleOutlined,
    LinkedinFilled
} from '@ant-design/icons';

const LoginForm = ({ onFinish, isSubmitting, onForgotPasswordClick }) => {
    return (
        <Form
            name="login"
            onFinish={onFinish}
            className="auth-form mt-[55px]"
            layout="vertical"
        >
            <h1 className='font-bold text-2xl mb-2'>Đăng nhập</h1>
            <div className="social-container mb-2">
                <a href="#" className="social">
                    <FacebookFilled className="social-icon " />
                </a>
                <a href="#" className="social">
                    <GoogleOutlined className="social-icon" />
                </a>
                <a href="#" className="social">
                    <LinkedinFilled className="social-icon" />
                </a>
            </div>
            <span className='text-gray-500 my-2'>hoặc sử dụng tài khoản của bạn</span>

            <Form.Item
                name="email"
                className="w-full mb-3"
                rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                ]}
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
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
                <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon mr-2" />}
                    placeholder="Mật khẩu"
                    className="h-10 rounded-md input-with-centered-prefix"
                />
            </Form.Item>

            <a onClick={onForgotPasswordClick} className="forgot-password block text-right mb-2">
                Quên mật khẩu?
            </a>

            <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                className="auth-button w-full h-10"
            >
                Đăng nhập
            </Button>
        </Form >
    );
};

export default LoginForm;