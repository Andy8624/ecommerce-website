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

const { Content } = Layout;

const ProductOverviewPage = () => {
    const location = useLocation();
    const isSimilar = location?.state?.isSimilar;
    const realTool = location?.state?.realTool;

    const { getToolById } = useGetToolByToolId(realTool?.toolId);
    const tool = isSimilar ? getToolById : realTool;


    // const shopData = {
    //     logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQS_T5NL66MkewmvfUvKiaauZ1TATYBTiYdg&s",
    //     name: "YOLO Stationery",
    //     lastOnline: "3 giờ trước",
    //     reviews: "176,6k",
    //     responseRate: 91,
    //     joined: "29 tháng trước",
    //     products: 359,
    //     responseTime: "trong vài giờ",
    //     followers: "112,5k",
    // };

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
                {/* <CardContainer>
                    <ShopInfo shop={shopData} />
                </CardContainer> */}

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
