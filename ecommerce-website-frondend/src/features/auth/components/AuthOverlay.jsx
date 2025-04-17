const AuthOverlay = ({ isActive, onPanelChange }) => {
    return (
        <div className="overlay-container">
            <div className="overlay">
                <div className="overlay-panel overlay-left">
                    <h1 className="text-white font-bold text-2xl">Chào mừng trở lại!</h1>
                    <p className="mb-4">
                        Để tiếp tục mua sắm, vui lòng đăng nhập với tài khoản của bạn
                    </p>
                    <button
                        className="ghost auth-button py-2 px-6"
                        onClick={() => onPanelChange(false)}
                    >
                        Đăng nhập
                    </button>
                </div>
                <div className="overlay-panel overlay-right">
                    <h1 className="font-bold text-2xl text-white">Xin chào!</h1>
                    <p className="mb-4">Đăng ký tài khoản để bắt đầu mua sắm cùng chúng tôi</p>
                    <button
                        className="ghost auth-button py-2 px-6"
                        onClick={() => onPanelChange(true)}
                    >
                        Đăng ký
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthOverlay;