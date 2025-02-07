import { Button, Layout } from "antd";
import { useNavigate } from "react-router-dom";
import CardContainer from "../components/CardContainer";

const { Content } = Layout;

export default function BecomeSellerPage() {
    const navigate = useNavigate();

    return (
        <Content className="flex items-center justify-center">
            <CardContainer className="text-center">
                <img
                    src="/public/images/seller-logo.jpg"
                    alt="Shopee Register"
                    className="w-80 mx-auto mb-4"
                />
                <h2 className="text-xl font-semibold mb-2">Chào mừng đến với EduMall Seller!</h2>
                <p className="text-gray-600 mb-4">
                    Vui lòng cung cấp thông tin để thiết lập người bán trên EduMall
                </p>
                <Button
                    type="primary"
                    size="large"
                    className="bg-blue-400 hover:bg-orange-600"
                    onClick={
                        () => navigate('/become-seller/register')
                    }
                >
                    Bắt đầu đăng ký
                </Button>
            </CardContainer>
        </Content>
    );
}
