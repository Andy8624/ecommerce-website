import { useState, useEffect, useRef } from 'react';
import { Button } from 'antd'; // Nhớ import Button từ antd
import { ArrowLeftOutlined } from '@ant-design/icons';

const OtpForm = ({ onFinish, isSubmitting, onBack, email }) => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputRefs = useRef([]);

    // Focus vào input đầu tiên khi component mount
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (e, index) => {
        const value = e.target.value;

        // Chỉ cho phép nhập số
        if (value && !/^\d+$/.test(value)) return;

        // Cập nhật giá trị OTP
        const newOtp = [...otp];
        newOtp[index] = value.slice(0, 1); // Chỉ lấy 1 ký tự
        setOtp(newOtp);

        // Nếu đã nhập giá trị và không phải ô cuối cùng, focus vào ô tiếp theo
        if (value && index < 3) {
            inputRefs.current[index + 1].focus();
        }

        // Kiểm tra xem đã nhập đủ 4 số chưa để tự động submit
        if (newOtp.every(digit => digit) && newOtp.length === 4) {
            setTimeout(() => {
                handleSubmit();
            }, 300);
        }
    };

    const handleKeyDown = (e, index) => {
        // Xử lý khi nhấn Backspace
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                // Nếu ô hiện tại trống và không phải ô đầu tiên, focus vào ô trước đó
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();

        // Kiểm tra xem dữ liệu dán có phải là 4 chữ số không
        if (/^\d{4}$/.test(pastedData)) {
            const newOtp = pastedData.split('');
            setOtp(newOtp);

            // Focus vào ô cuối cùng
            inputRefs.current[3].focus();

            // Tự động submit sau khi dán
            setTimeout(() => {
                handleSubmit();
            }, 300);
        }
    };

    const handleSubmit = () => {
        const otpValue = otp.join('');
        if (otpValue.length === 4) {
            onFinish({ otp: otpValue });
        }
    };

    return (
        <div className="flex flex-col items-center w-full p-[5rem]">
            {/* Tiêu đề */}
            <h4 className="text-2xl font-semibold mb-1 text-center">Xác thực OTP</h4>
            <p className="text-gray-500 mb-6 text-center">
                Mã xác thực đã được gửi đến email <span className="font-medium">{email}</span>
            </p>

            {/* OTP Input Boxes */}
            <div className="flex justify-center items-center space-x-3 my-5 w-full">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={el => inputRefs.current[index] = el}
                        type="text"
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={index === 0 ? handlePaste : null}
                        maxLength={1}
                        className="w-4 h-4 md:w-14 md:h-14 text-center text-3xl font-semibold
                                  border border-gray-300 rounded-lg shadow-sm
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                  transition-all duration-200"
                    />
                ))}
            </div>

            {/* Thông báo gửi lại mã */}
            {/* <p className="text-gray-500 mb-6 text-center">
                Không nhận được mã?
                <button className="text-blue-500 hover:text-blue-700 font-medium ml-1 focus:outline-none">
                    Gửi lại mã
                </button>
            </p> */}

            {/* Nút xác nhận - đã cập nhật */}
            <Button
                type="primary"
                onClick={handleSubmit}
                loading={isSubmitting}
                className="auth-button w-full h-12 mb-4"
            >
                Xác nhận
            </Button>

            {/* Nút quay lại */}
            <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={onBack}
                className="mt-2"
            >
                Quay lại
            </Button>
        </div>
    );
};

export default OtpForm;