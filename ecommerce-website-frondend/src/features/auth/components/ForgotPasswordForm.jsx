import { Button, Form, Input, Typography } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const { Title } = Typography;

const onFinish = (values) => {
    console.log('Success:', values);
    // Xử lý đặt lại mật khẩu ở đây
};

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const ForgotPasswordForm = () => {
    const navigate = useNavigate(); // Khởi tạo useNavigate để điều hướng

    const handleLoginRedirect = () => {
        navigate('/auth/login'); // Chuyển đến trang đăng nhập
    };

    return (
        <>
            <Title level={2} className="text-center mb-6">
                Quên Mật Khẩu
            </Title>
            <Form
                name="forgot-password"
                labelCol={{
                    span: 24,
                }}
                wrapperCol={{
                    span: 24,
                }}
                style={{
                    maxWidth: 600,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Email"
                    name="email"  // Trường cho email
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập email!',
                        },
                        {
                            type: 'email',
                            message: 'Email không hợp lệ!',
                        },
                    ]}
                >
                    <Input autoFocus />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 0,
                        span: 24,
                    }}
                >
                    <Button type="primary" htmlType="submit" className="w-full">
                        Gửi Đặt Lại Mật Khẩu
                    </Button>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 0,
                        span: 24,
                    }}
                >
                    <Button type="link" onClick={handleLoginRedirect} className="w-full text-center">
                        Đã nhớ mật khẩu? Đăng nhập ngay!
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default ForgotPasswordForm;
