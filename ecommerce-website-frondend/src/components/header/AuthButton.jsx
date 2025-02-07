import { Button } from 'antd';

const AuthButton = ({ navigate }) => {
    return (
        <div className='flex items-center'>
            <Button
                onClick={() => navigate('/auth/login')}
                type="primary"
                className="mr-2 text-sm shadow-lg bg-blue-300 hover:bg-blue-400 text-white font-medium rounded-md px-5 py-2.5 transition duration-200">
                Đăng nhập
            </Button>

            <Button
                onClick={() => navigate('/auth/register')}
                type="default"
                className="text-sm shadow-lg bg-white hover:bg-gray-100 text-blue-500 font-medium rounded-md px-5 py-2.5 border border-blue-500 transition duration-200">
                Đăng ký
            </Button>
        </div>
    );
};

export default AuthButton;
