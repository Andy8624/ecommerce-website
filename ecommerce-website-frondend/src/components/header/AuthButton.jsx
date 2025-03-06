const AuthButton = ({ navigate }) => {
    return (
        <div className='flex items-center'>
            <button
                onClick={() => navigate('/auth/login')}
                className="mr-4 login-button px-5 py-2 rounded hover:scale-105"
            >
                Đăng nhập
            </button>

            <button
                onClick={() => navigate('/auth/register')}
                className="signup-button px-5 py-2 hover:scale-105 rounded">
                Đăng ký
            </button>
        </div >
    );
};

export default AuthButton;
