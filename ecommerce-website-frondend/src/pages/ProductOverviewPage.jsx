import { Row, Layout } from "antd";
import ProductGallery from "../features/product-overview/components/ProductGallery";
import ProductInfo from "../features/product-overview/components/ProductInfo";
import ShopInfo from "../features/product-overview/components/ShopInfo";
import ProductDetails from "../features/product-overview/components/ProductDetails";
import CardContainer from "../components/CardContainer";
import DescriptionProduct from "../features/product-overview/components/DescriptionProduct";
import { useLocation } from "react-router-dom";

const { Content } = Layout;

const ProductOverviewPage = () => {
    const location = useLocation();
    const tool = location.state;
    console.log(tool);
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

    const options = [
        { id: 1, name: "1 bút", stock: 50 },
        { id: 2, name: "3 ống mực tím", stock: 30 },
        { id: 3, name: "3 ống mực xanh", stock: 20 },
        { id: 4, name: "3 ống mực đen", stock: 10 },
    ]

    return (
        <Layout style={{ backgroundColor: "#f5f5f5" }} >
            <Content style={{ maxWidth: "1200px", margin: "0 auto" }}>
                {/* Gallery and Info */}
                <CardContainer>
                    <Row gutter={[16, 16]} >
                        <ProductGallery tool={tool} />
                        <ProductInfo
                            tool={tool}
                            options={options}
                        />
                    </Row>
                </CardContainer>

                {/* Shop Info */}
                {/* <CardContainer>
                    <ShopInfo shop={shopData} />
                </CardContainer> */}

                {/* Product Details */}
                <CardContainer>
                    <ProductDetails details={productDetailsData} />
                </CardContainer>

                <CardContainer>
                    <DescriptionProduct description={tool?.description} />
                </CardContainer>
            </Content>
        </Layout >
    );
};

export default ProductOverviewPage;
