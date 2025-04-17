import { Form, Input, Button } from 'antd';
import { MailOutlined } from '@ant-design/icons';

const ForgotPasswordForm = ({ onFinish, isSubmitting, onBackToLogin }) => {
    return (
        <Form
            name="forgot-password"
            onFinish={onFinish}
            className="auth-form mt-[100px]"
            layout="vertical"
        >
            <h1 className='font-bold text-3xl uppercase'>Quên mật khẩu</h1>
            <p className="forgot-password-text text-center">
                Nhập email đăng ký của bạn để nhận link đặt lại mật khẩu
            </p>

            <Form.Item
                name="email"
                className="w-full mb-4"
                rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                ]}
            >
                <Input
                    prefix={<MailOutlined className="site-form-item-icon mr-2" />}
                    placeholder="Email"
                    className="h-12 rounded-md input-with-centered-prefix"
                />
            </Form.Item>

            <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                className="auth-button w-full h-12 mb-4"
            >
                Gửi yêu cầu
            </Button>

            <a onClick={onBackToLogin} className="back-to-login block text-center">
                Quay lại đăng nhập
            </a>
        </Form>
    );
};

export default ForgotPasswordForm;