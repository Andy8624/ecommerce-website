import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, register, checkEmailExists, resetPassword } from '../../../services/AuthService';
import { useDispatch } from 'react-redux';
import { setLoginUserInfo } from '../../../redux/slices/accountSlice';
import { useCartByUserId } from '../hooks/useGetCartByUserId';

// Import các component đã tách
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import AuthOverlay from '../components/AuthOverlay';

import './AuthPage.css';

const AuthPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [isActive, setIsActive] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { getCartByUserId } = useCartByUserId();
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    useEffect(() => {
        // Xác định mode dựa vào đường dẫn
        if (location.pathname.includes('register')) {
            setIsActive(true);
        } else if (location.pathname.includes('forgot-password')) {
            setShowForgotPassword(true);
        } else {
            setIsActive(false);
            setShowForgotPassword(false);
        }
    }, [location.pathname]);

    const handlePanelChange = (isSignUp) => {
        setIsActive(isSignUp);
        navigate(isSignUp ? '/auth/register' : '/auth/login');
        setShowForgotPassword(false);
    };

    const handleForgotPasswordClick = () => {
        setShowForgotPassword(true);
        navigate('/auth/forgot-password');
    };

    const handleBackToLogin = () => {
        setShowForgotPassword(false);
        setIsActive(false);
        navigate('/auth/login');
    };

    // Xử lý đăng nhập
    const handleLogin = async (values) => {
        const { email, password } = values;

        setIsSubmitting(true);
        try {
            // Kiểm tra email tồn tại
            const emailExists = await checkEmailExists(email);
            if (!emailExists?.data) {
                toast.error('Email không tồn tại');
                setIsSubmitting(false);
                return;
            }

            const res = await login(email, password);

            if (res?.data) {
                localStorage.setItem('access_token', res.data.access_token);
                const cart = await getCartByUserId(res.data.user.id);
                res.data.user.cartId = cart?.cartId;
                dispatch(setLoginUserInfo(res.data.user));

                toast.success('Đăng nhập thành công');
                navigate('/');
            } else {
                toast.error('Đăng nhập thất bại');
            }
        } catch (error) {
            toast.error('Đăng nhập thất bại');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Xử lý đăng ký
    const handleRegister = async (values) => {
        const { email, fullName, password } = values;

        setIsSubmitting(true);
        try {
            // Kiểm tra email đã tồn tại chưa
            const emailCheck = await checkEmailExists(email);

            if (emailCheck?.data) {
                toast.error('Email đã tồn tại, vui lòng sử dụng email khác!');
                return;
            }

            // Tiến hành đăng ký
            const result = await register(email, password, fullName);

            if (result?.success) {
                toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
                setIsActive(false);
                navigate('/auth/login');
            } else {
                toast.error(result?.message || 'Đăng ký thất bại, vui lòng thử lại.');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau.');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Xử lý quên mật khẩu
    const handleForgotPassword = async (values) => {
        const { email } = values;

        setIsSubmitting(true);
        try {
            // Kiểm tra email tồn tại
            const emailCheck = await checkEmailExists(email);

            if (!emailCheck?.data) {
                toast.error('Email không tồn tại trong hệ thống!');
                setIsSubmitting(false);
                return;
            }

            // Gửi yêu cầu đặt lại mật khẩu
            const result = await resetPassword(email);

            if (result?.success) {
                toast.success('Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn!');
                setShowForgotPassword(false);
                navigate('/auth/login');
            } else {
                toast.error(result?.message || 'Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại.');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau.');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className={`auth-container ${isActive ? 'right-panel-active' : ''}`}>
                {/* Đăng ký Form */}
                <div className="form-container sign-up-container">
                    <RegisterForm
                        onFinish={handleRegister}
                        isSubmitting={isSubmitting}
                    />
                </div>

                {/* Đăng nhập hoặc Quên mật khẩu Form */}
                <div className="form-container sign-in-container">
                    {showForgotPassword ? (
                        <ForgotPasswordForm
                            onFinish={handleForgotPassword}
                            isSubmitting={isSubmitting}
                            onBackToLogin={handleBackToLogin}
                        />
                    ) : (
                        <LoginForm
                            onFinish={handleLogin}
                            isSubmitting={isSubmitting}
                            onForgotPasswordClick={handleForgotPasswordClick}
                        />
                    )}
                </div>

                {/* Overlay Container */}
                <AuthOverlay
                    isActive={isActive}
                    onPanelChange={handlePanelChange}
                />
            </div>
        </div>
    );
};

export default AuthPage;