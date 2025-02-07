import { Content } from 'antd/es/layout/layout'
import { Button } from 'antd'
// import { useNavigate } from 'react-router-dom'
import { CheckCircleTwoTone } from '@ant-design/icons'

const CompleteRegister = () => {
    // const navigate = useNavigate()
    return (
        <Content className="text-center h-[52vh]">
            <CheckCircleTwoTone twoToneColor="#52c41a" className='text-[5rem] mt-[3rem] mb-5' />
            <h2 className="text-xl font-semibold mb-2">Đăng ký thành công</h2>
            <p className="text-gray-600 mb-4">
                Hãy đăng bán sản phẩm đầu tiên để khởi động hành trình bán hàng cùng EduMall nhé!
            </p>
            <Button
                type="primary"
                size="large"
                className="bg-blue-400 hover:bg-orange-600"
                onClick={[
                    // () => navigate('/become-seller/register'),
                    () => alert('Đăng ký thành công')
                ]}
            >
                Thêm sản phẩm
            </Button>
        </Content>

    )
}

export default CompleteRegister