import { Row, Layout, Divider } from "antd";
import { useEffect } from "react"; // Thêm useEffect và useRef
import { useSelector } from "react-redux"; // Thêm useSelector để lấy thông tin user
import ProductGallery from "../features/product-overview/components/ProductGallery";
import ProductInfo from "../features/product-overview/components/ProductInfo";
import ProductDetails from "../features/product-overview/components/ProductDetails";
import CardContainer from "../components/CardContainer";
import DescriptionProduct from "../features/product-overview/components/DescriptionProduct";
import { useLocation } from "react-router-dom";
import ProductPreview from "../features/product-overview/components/ProductPreview";
import { useGetToolByToolId } from "../features/checkout/hooks/tools/useGetToolByToolId";
import ShopInfo from "../features/product-overview/components/ShopInfo";
import { useGetUserById } from "../hooks/useGetUserById";
import { AVT_URL } from "../utils/Config";
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useGetTotalRatedOfProductByShopId, useTotalSoldTool, useTotalTool } from "../hooks/useTotalTool";
import { saveInteraction } from "../services/RecomendationService"; // Thêm import saveInteraction
import ShopOtherProduct from "../features/product-overview/components/ShopOtherProduct";
import SimilarProductList from "../features/tools/components/SimilarProductList";
const { Content } = Layout;

const ProductOverviewPage = () => {
    const location = useLocation();
    const realTool = location?.state?.realTool;
    const { getToolById } = useGetToolByToolId(realTool?.toolId);
    const tool = getToolById;
    const shopId = tool?.user?.userId;
    const { getUserById } = useGetUserById(shopId);
    const { totalTool } = useTotalTool(shopId);
    const { totalSoldTool } = useTotalSoldTool(shopId);
    const { totalRated } = useGetTotalRatedOfProductByShopId(shopId);

    // Lấy thông tin user từ Redux store
    const user = useSelector(state => state.account?.user);

    // Ghi nhận tương tác VIEW khi người dùng xem trang sản phẩm
    useEffect(() => {
        // Chỉ thực hiện khi có thông tin tool và user
        if (tool?.toolId && user?.id) {
            // Set timeout để tránh gọi API quá sớm khi component vẫn đang rendering
            const timer = setTimeout(() => {
                saveInteraction(user.id, tool.toolId, 'VIEW');
                console.log(`Logged VIEW interaction for user ${user.id} on product ${tool.toolId}`);
            }, 2000); // Đợi 2 giây để đảm bảo người dùng thực sự xem sản phẩm

            return () => clearTimeout(timer); // Cleanup để tránh memory leak
        }
    }, [tool?.toolId, user?.id]);

    const formatJoinedTime = (createdAtStr) => {
        // Giữ nguyên code hiện tại
        if (!createdAtStr) return "Chưa xác định";

        try {
            const createdAt = new Date(createdAtStr);

            // Tính số tháng từ ngày tạo đến hiện tại
            const now = new Date();
            const monthDiff = (now.getFullYear() - createdAt.getFullYear()) * 12 +
                now.getMonth() - createdAt.getMonth();

            if (monthDiff >= 12) {
                const years = Math.floor(monthDiff / 12);
                return `${years} năm trước`;
            } else if (monthDiff > 0) {
                return `${monthDiff} tháng trước`;
            } else {
                // Sử dụng formatDistanceToNow cho thời gian ngắn hơn 1 tháng
                return formatDistanceToNow(createdAt, { locale: vi, addSuffix: true });
            }
        } catch (error) {
            console.error("Lỗi khi xử lý thời gian:", error);
            return "Chưa xác định";
        }
    };

    const shopData = {
        userId: shopId,
        logo: AVT_URL + getUserById?.imageUrl,
        name: getUserById?.shopName,
        lastOnline: "3 giờ trước",
        reviews: totalRated || 0,
        responseRate: 91,
        joined: formatJoinedTime(getUserById?.createdAt),
        products: totalTool || 0,
        soldProducts: totalSoldTool || 0,
        responseTime: "trong vài giờ",
        followers: "112,5k",
    };

    const productDetailsData = {
        category: tool?.toolType?.name,
        stock: tool?.stockQuantity,
        brand: tool?.brand,
        warranty: tool?.warranty,
        origin: tool?.origin,
        shippingFrom: tool?.user?.address[0]?.city
    };

    return (
        <Layout style={{ backgroundColor: "#f5f5f5" }} >
            <Content style={{ maxWidth: "1200px", margin: "0 auto" }}>
                {/* Gallery and Info */}
                <CardContainer>
                    <Row gutter={[16, 16]} >
                        <ProductGallery tool={tool} />
                        <ProductInfo tool={tool} />
                    </Row>
                </CardContainer>

                {/* Shop Info */}
                <CardContainer>
                    <ShopInfo shop={shopData} />
                </CardContainer>

                {/* Product Details */}
                <CardContainer>
                    <ProductDetails details={productDetailsData} moreDetails={tool?.attributes} />
                </CardContainer>

                <CardContainer>
                    <DescriptionProduct description={tool?.description} />
                </CardContainer>

                <CardContainer>
                    <ProductPreview />
                </CardContainer>

                <div className="px-7">
                    <ShopOtherProduct
                        shopId={shopId}
                        currentToolId={tool?.toolId}
                        pageSize={12}
                    />
                </div>

                <Divider />

                <div>
                    <SimilarProductList pageSize={12} showFindingProduct={false} />
                </div>
            </Content>
        </Layout >
    );
};

export default ProductOverviewPage;
