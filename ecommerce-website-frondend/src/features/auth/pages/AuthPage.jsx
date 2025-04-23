import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, register, checkEmailExists, resetPassword, verifyOtp, setNewPassword } from '../../../services/AuthService'; // Thêm verifyOtp và setNewPassword
import { useDispatch } from 'react-redux';
import { setLoginUserInfo } from '../../../redux/slices/accountSlice';
import { useCartByUserId } from '../hooks/useGetCartByUserId';

// Import các component
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import OtpForm from '../components/OtpForm'; // Import OTP form
import ResetPasswordForm from '../components/ResetPasswordForm'; // Import Reset Password form
import AuthOverlay from '../components/AuthOverlay';

import './AuthPage.css';

const AuthPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [isActive, setIsActive] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { getCartByUserId } = useCartByUserId();

    // Thêm các state mới để quản lý luồng quên mật khẩu
    const [forgotPasswordFlow, setForgotPasswordFlow] = useState('form'); // 'form', 'otp', 'reset'
    const [resetEmail, setResetEmail] = useState('');
    const [resetToken, setResetToken] = useState('');

    useEffect(() => {
        // Xác định mode dựa vào đường dẫn
        if (location.pathname.includes('register')) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }

        // Xử lý quy trình quên mật khẩu
        if (location.pathname.includes('forgot-password')) {
            const searchParams = new URLSearchParams(location.search);
            const step = searchParams.get('step');
            const savedEmail = localStorage.getItem('reset_email');

            if (savedEmail && !resetEmail) {
                setResetEmail(savedEmail);
            }

            if (step === 'otp') {
                setForgotPasswordFlow('otp');
            } else if (step === 'reset') {
                setForgotPasswordFlow('reset');
            } else {
                setForgotPasswordFlow('form');
            }
        } else {
            // Reset flow khi không ở trang forgot-password
            setForgotPasswordFlow('form');
            localStorage.removeItem('reset_email');
        }
    }, [location.pathname, location.search, resetEmail]);

    const handlePanelChange = (isSignUp) => {
        setIsActive(isSignUp);
        navigate(isSignUp ? '/auth/register' : '/auth/login');
        setForgotPasswordFlow('form'); // Reset forgot password flow
    };

    const handleForgotPasswordClick = () => {
        setForgotPasswordFlow('form');
        navigate('/auth/forgot-password');
    };

    // Quay lại trang đăng nhập từ form quên mật khẩu
    const handleBackToLogin = () => {
        setForgotPasswordFlow('form');
        navigate('/auth/login');
    };

    // Quay lại form nhập email từ form OTP
    const handleBackFromOtp = () => {
        setForgotPasswordFlow('form');
        navigate('/auth/forgot-password');
    };

    // Quay lại form OTP từ form đặt lại mật khẩu
    const handleBackFromReset = () => {
        setForgotPasswordFlow('otp');
        navigate('/auth/forgot-password?step=otp');
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
                setIsSubmitting(false);
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

    // Sửa lại hàm handleForgotPassword

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
                // Lưu email ngay khi nhận được kết quả thành công
                console.log("OTP success, changing flow to:", 'otp');
                setResetEmail(email);
                localStorage.setItem('reset_email', email);
                setForgotPasswordFlow('otp');
                console.log("Flow after set:", forgotPasswordFlow); // Sẽ vẫn là 'form' vì state chưa được cập nhật
                toast.success('Mã xác thực OTP đã được gửi đến email của bạn!');
                setTimeout(() => {
                    console.log("Navigating with flow:", forgotPasswordFlow);
                    navigate('/auth/forgot-password?step=otp');
                }, 50);
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

    // Xử lý xác thực OTP
    const handleVerifyOtp = async (values) => {
        const { otp } = values;

        setIsSubmitting(true);
        try {
            const result = await verifyOtp(resetEmail, otp);

            if (result?.success) {
                toast.success('Xác thực OTP thành công! Vui lòng đặt lại mật khẩu.');
                setResetToken(result.data.token); // Lưu token để sử dụng cho bước đặt lại mật khẩu
                setForgotPasswordFlow('reset');
                navigate('/auth/forgot-password?step=reset');
            } else {
                toast.error(result?.message || 'Xác thực OTP thất bại. Vui lòng thử lại.');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau.');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Xử lý đặt lại mật khẩu
    const handleResetPassword = async (values) => {
        const { newPassword } = values;

        setIsSubmitting(true);
        try {
            const result = await setNewPassword(resetEmail, newPassword);

            if (result?.success) {
                toast.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập.');
                setForgotPasswordFlow('form');
                navigate('/auth/login');
            } else {
                toast.error(result?.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
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
                    {location.pathname.includes('forgot-password') ? (
                        <>
                            {/* Đơn giản hóa logic để hiển thị form dựa trên forgotPasswordFlow */}
                            {forgotPasswordFlow === 'otp' && (
                                <OtpForm
                                    onFinish={handleVerifyOtp}
                                    isSubmitting={isSubmitting}
                                    onBack={handleBackFromOtp}
                                    email={resetEmail}
                                />
                            )}
                            {forgotPasswordFlow === 'reset' && (
                                <ResetPasswordForm
                                    onFinish={handleResetPassword}
                                    isSubmitting={isSubmitting}
                                    onBack={handleBackFromReset}
                                />
                            )}
                            {forgotPasswordFlow === 'form' && (
                                <ForgotPasswordForm
                                    onFinish={handleForgotPassword}
                                    isSubmitting={isSubmitting}
                                    onBackToLogin={handleBackToLogin}
                                />
                            )}
                        </>
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
            {console.log("Current forgotPasswordFlow:", forgotPasswordFlow)}
            {console.log("Current location:", location.pathname, location.search)}
        </div>
    );
};

export default AuthPage;