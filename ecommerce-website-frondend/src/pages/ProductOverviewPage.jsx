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
    // console.log(tool);
    const shopData = {
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQS_T5NL66MkewmvfUvKiaauZ1TATYBTiYdg&s",
        name: "YOLO Stationery",
        lastOnline: "3 giờ trước",
        reviews: "176,6k",
        responseRate: 91,
        joined: "29 tháng trước",
        products: 359,
        responseTime: "trong vài giờ",
        followers: "112,5k",
    };

    const productDetailsData = {
        category: "Shopee > Nhà Sách Online > Bút viết > Viết Máy & Mực",
        stock: 1098837,
        shippingFrom: "Nước ngoài",
    };

    const tempProduct = {
        name: "Bút máy capybara xóa được",
        images: [
            "https://d1hjkbq40fs2x4.cloudfront.net/2017-08-21/files/landscape-photography_1645-t.jpg",
            "https://focusasiatravel.vn/wp-content/uploads/2021/04/trantuanviet-bavi-hanoi-1617326198.jpg",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCPJjv1bOQK5NeKBVsFLZCAMibH96pVRVLN8GMu2HXCFXLiLGyBRQNTLzI30qlqGgML28&usqp=CAU",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvNPfCI7nzUNGhPDTL_HT5tmIkA3ssVZFuGA&s",
            "https://focusasiatravel.vn/wp-content/uploads/2021/04/trantuanviet-bavi-hanoi-1617326198.jpg",
            "https://focusasiatravel.vn/wp-content/uploads/2021/04/trantuanviet-bavi-hanoi-1617326198.jpg",
            "https://focusasiatravel.vn/wp-content/uploads/2021/04/trantuanviet-bavi-hanoi-1617326198.jpg",
        ],
        price: 9000,
        discountedPrice: 4000,
        stockQuantity: 100,
        options: [
            { id: 1, name: "1 bút", stock: 50 },
            { id: 2, name: "3 ống mực tím", stock: 30 },
            { id: 3, name: "3 ống mực xanh", stock: 20 },
            { id: 4, name: "3 ống mực đen", stock: 10 },
        ],
        rating: 4.7,
        reviewCount: 166,
    };

    return (
        <Layout style={{ backgroundColor: "#f5f5f5" }} >
            <Content style={{ maxWidth: "1200px", margin: "0 auto" }}>
                {/* Gallery and Info */}
                <CardContainer>
                    <Row gutter={[16, 16]} >
                        <ProductGallery tool={tool} images={tempProduct.images} productName={tempProduct.name} />
                        <ProductInfo
                            tool={tool}
                            name={tool.name}
                            rating={tool.averageRating}
                            reviewCount={tool.totalRating}
                            price={tool.price}
                            discountedPrice={tool.discountedPrice}
                            stockQuantity={tool.stockQuantity}
                            options={tempProduct.options}
                        />
                    </Row>
                </CardContainer>

                {/* Shop Info */}
                <CardContainer>
                    <ShopInfo shop={shopData} />
                </CardContainer>

                {/* Product Details */}
                <CardContainer>
                    <ProductDetails details={productDetailsData} />
                </CardContainer>

                <CardContainer>
                    <DescriptionProduct />
                </CardContainer>
            </Content>
        </Layout >
    );
};

export default ProductOverviewPage;
