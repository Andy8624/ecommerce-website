import { Row, Layout } from "antd";
import ProductGallery from "../features/product-overview/components/ProductGallery";
import ProductInfo from "../features/product-overview/components/ProductInfo";
// import ShopInfo from "../features/product-overview/components/ShopInfo";
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

const { Content } = Layout;

const ProductOverviewPage = () => {
    const location = useLocation();
    // const isSimilar = location?.state?.isSimilar;
    const realTool = location?.state?.realTool;

    const { getToolById } = useGetToolByToolId(realTool?.toolId);
    // const tool = isSimilar ? getToolById : realTool;
    const tool = getToolById;
    const shopId = tool?.user?.userId;
    const { getUserById } = useGetUserById(shopId);
    // console.log("getUserById", getUserById);
    // console.log("created_at", getUserById?.createdAt);

    const { totalTool } = useTotalTool(shopId);

    const { totalSoldTool } = useTotalSoldTool(shopId);

    const { totalRated } = useGetTotalRatedOfProductByShopId(shopId);
    // console.log("totalRated", totalRated);

    const formatJoinedTime = (createdAtStr) => {
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

    // Kiểm tra dữ liệu shop trước khi truyền vào ShopInfo
    // console.log("getUserById", getUserById);

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
            </Content>
        </Layout >
    );
};

export default ProductOverviewPage;
