import { Button, Form, Input, Typography } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { checkEmailExists, login } from '../../../services/AuthService';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setLoginUserInfo } from '../../../redux/slices/accountSlice';
import { useCartByUserId } from '../hooks/useGetCartByUserId';
const { Title } = Typography;

const LoginForm = () => {
    const navigate = useNavigate();
    const handleRegisterRedirect = () => {
        navigate('/auth/register');
    };
    const handleForgotPasswordRedirect = () => {
        navigate('/auth/forgot-password');
    };

    const [isSubmit, setIsSubmit] = useState(false);
    const dispatch = useDispatch();

    const { getCartByUserId } = useCartByUserId();
    const onFinish = async (values) => {
        const { email, password } = values;
        // Check email tồn tại hay không
        const emailExists = await checkEmailExists(email);
        if (!emailExists?.data) {
            toast.error('Email không tồn tại');
            setIsSubmit(false);
            return;
        }

        setIsSubmit(true);
        const res = await login(email, password);

        if (res?.data) {
            localStorage.setItem('access_token', res.data.access_token);
            // console.log(res.data.user.id);
            const cart = await getCartByUserId(res.data.user.id);
            // console.log(cart);
            res.data.user.cartId = cart?.cartId;
            dispatch(setLoginUserInfo(res.data.user))

            toast.success('Đăng nhập thành công');
            navigate('/');
        } else {
            toast.error('Đăng nhập thất bại');
            setIsSubmit(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    return (
        <>
            <Title level={2} className="text-center mb-6">
                Đăng Nhập
            </Title>
            <Form
                name="basic"
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
                    label="Mật khẩu"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 0,
                        span: 24,
                    }}
                >
                    <Button type="primary" htmlType="submit" className="w-full" loading={isSubmit}>
                        Đăng Nhập
                    </Button>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 0,
                        span: 24,
                    }}
                >
                    <Button type="link" onClick={handleRegisterRedirect} className="w-full text-center">
                        Bạn chưa có tài khoản? Đăng ký ngay!
                    </Button>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 0,
                        span: 24,
                    }}
                >
                    <Button type="link" onClick={handleForgotPasswordRedirect} className="w-full text-center">
                        Quên mật khẩu?
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default LoginForm;
