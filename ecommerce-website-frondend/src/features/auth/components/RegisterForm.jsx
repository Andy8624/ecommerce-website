import { Button, Form, Input, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const { Title } = Typography;

const onFinish = (values) => {
    console.log('Success:', values);
};

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const RegisterForm = () => {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/auth/login');
    };

    return (
        <>
            <Title level={2} className="text-center mb-4">
                Đăng Ký
            </Title>
            <Form
                name="register"
                labelCol={{
                    span: 24,
                }}
                wrapperCol={{
                    span: 24,
                }}
                style={{
                    maxWidth: 800,
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
                    name="email"
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
                    label="Tên đầy đủ"
                    name="fullName"  // Trường cho tên đầy đủ
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên đầy đủ!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="Mật khẩu" wrapperCol={{ span: 24 }}>
                    <Space.Compact>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu!',
                                },
                            ]}
                            style={{ width: 'calc(50% - 8px)', display: 'inline-block' }} // Mật khẩu 50% chiều rộng
                        >
                            <Input.Password placeholder="Mật khẩu" />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập lại mật khẩu!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu không khớp!'));
                                    },
                                }),
                            ]}
                            style={{ width: 'calc(50% - 8px)', display: 'inline-block', marginLeft: '8px' }} // Nhập lại mật khẩu 50% chiều rộng
                        >
                            <Input.Password placeholder="Nhập lại mật khẩu" />
                        </Form.Item>
                    </Space.Compact>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 0,
                        span: 24,
                    }}
                >
                    <Button type="primary" htmlType="submit" className="w-full">
                        Đăng Ký
                    </Button>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 0,
                        span: 24,
                    }}
                >
                    <Button type="link" onClick={handleLoginRedirect} className="w-full text-center">
                        Đã có tài khoản? Đăng nhập ngay!
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default RegisterForm;
