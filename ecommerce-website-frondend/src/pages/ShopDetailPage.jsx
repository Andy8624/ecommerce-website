import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Layout, Row, Col, Typography, Tabs, Card,
    Button, Statistic, Divider, Spin, Empty,
    Select, Input, Pagination, Tooltip
} from "antd";
import {
    ShopOutlined, StarOutlined, ShoppingOutlined,
    SearchOutlined, MessageOutlined, FieldTimeOutlined,
    CalendarOutlined, UserOutlined,
    PhoneOutlined, MailOutlined
} from "@ant-design/icons";
import { useGetUserById } from "../hooks/useGetUserById";
import { useGetAllToolByUserId } from "../features/seller/hooks/useGetAllToolByUserId";
import { useTotalTool, useTotalSoldTool, useGetTotalRatedOfProductByShopId } from "../hooks/useTotalTool";
import { AVT_URL } from "../utils/Config";
import ToolItem from "../features/tools/components/ToolItem";
import CardContainer from "../components/CardContainer";
import { toast } from "react-toastify";

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const ShopDetailPage = () => {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState("newest");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Fetch shop data
    const { getUserById: shop, isLoading: loadingShop } = useGetUserById(shopId);

    // Fetch shop stats
    const { totalTool } = useTotalTool(shopId);
    const { totalSoldTool } = useTotalSoldTool(shopId);
    const { totalRated } = useGetTotalRatedOfProductByShopId(shopId);

    // Fetch shop products
    const { tools, isLoading: loadingProducts } = useGetAllToolByUserId(shopId);

    // Calculate shop stats
    const ratingAverage = totalRated > 0 ? 4.7 : 0; // Giả định rating trung bình, thay thế bằng dữ liệu thực tế nếu có

    // Format join date
    const formatJoinedTime = (createdAtStr) => {
        if (!createdAtStr) return "Chưa xác định";

        try {
            const createdAt = new Date(createdAtStr);

            // Định dạng ngày tháng năm
            return new Intl.DateTimeFormat('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).format(createdAt);
        } catch (error) {
            console.error("Lỗi khi xử lý thời gian:", error);
            return "Chưa xác định";
        }
    };

    // Handle search, filter and sort
    useEffect(() => {
        if (!tools) return;

        let result = [...tools];

        // Apply search filter
        if (searchTerm) {
            result = result.filter(tool =>
                tool.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply sorting
        switch (sortBy) {
            case "newest":
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case "oldest":
                result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case "price-asc":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                result.sort((a, b) => b.price - a.price);
                break;
            case "popular":
                result.sort((a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0));
                break;
            default:
                break;
        }

        setFilteredProducts(result);
    }, [tools, searchTerm, sortBy]);

    // Handle chat with seller
    const handleChatNow = () => {
        if (!shop) return;

        // Tạo contact object từ thông tin shop
        const shopContact = {
            userId: shop.userId,
            fullName: shop.fullName,
            imageUrl: shop.imageUrl ? AVT_URL + shop.imageUrl : "",
            shopName: shop.shopName,
        };

        // Kích hoạt sự kiện để mở cửa sổ chat
        const openChatWindowEvent = new CustomEvent('openChatWindow', {
            detail: shopContact
        });
        window.dispatchEvent(openChatWindowEvent);
    };

    if (loadingShop) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" tip="Đang tải thông tin cửa hàng..." />
            </div>
        );
    }

    if (!shop) {
        return (
            <div className="text-center py-16">
                <Empty
                    description="Không tìm thấy thông tin cửa hàng"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
                <Button
                    type="primary"
                    onClick={() => navigate(-1)}
                    className="mt-4"
                >
                    Quay lại
                </Button>
            </div>
        );
    }

    return (
        <Layout style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            <Content style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
                {/* Shop Header */}
                <CardContainer>
                    <Row gutter={[24, 24]} align="middle">
                        <Col xs={24} md={8} className="flex flex-col items-center md:items-start">
                            <div className="flex items-center mb-4">
                                {/* <Avatar
                                    // size={80}
                                    // width={80}
                                    // height={80}
                                    src={shop.imageUrl ? AVT_URL + shop.imageUrl : null}
                                    icon={!shop.imageUrl && <UserOutlined />}
                                /> */}
                                <img
                                    src={shop.imageUrl ? AVT_URL + shop.imageUrl : null}
                                    alt={shop.name}
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        marginRight: "10px",
                                    }}
                                    icon={!shop?.imageUrl && <UserOutlined />}

                                />
                                <div className="ml-4">
                                    <Title level={3} className="mb-1">
                                        {shop?.shopName}
                                    </Title>
                                    <div className="flex items-center">
                                        <Tooltip title="Ngày tham gia">
                                            <CalendarOutlined className="mr-1" />
                                            <Text className="mr-4">
                                                {formatJoinedTime(shop.createdAt)}
                                            </Text>
                                        </Tooltip>
                                        <Tooltip title="Tổng sản phẩm">
                                            <ShoppingOutlined className="mr-1" />
                                            <Text>{totalTool || 0}</Text>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 mb-4 md:mb-0">
                                <Button
                                    type="primary"
                                    icon={<MessageOutlined />}
                                    onClick={handleChatNow}
                                    className="mr-3"
                                >
                                    Chat Ngay
                                </Button>
                                <Button icon={<ShopOutlined />} onClick={() => toast.info("Tính năng đang phát triển!")}>Theo Dõi</Button>
                            </div>
                        </Col>

                        <Col xs={24} md={16}>
                            <Row gutter={[16, 16]}>
                                <Col span={8}>
                                    <Statistic
                                        title="Sản Phẩm"
                                        value={totalTool || 0}
                                        prefix={<ShoppingOutlined />}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Statistic
                                        title="Đã Bán"
                                        value={totalSoldTool || 0}
                                        prefix={<ShopOutlined />}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Statistic
                                        title="Đánh Giá"
                                        value={ratingAverage}
                                        prefix={<StarOutlined />}
                                        suffix={`(${totalRated || 0})`}
                                    />
                                </Col>
                            </Row>
                            <Divider style={{ margin: '12px 0' }} />
                            <Row gutter={[16, 16]} className="text-sm">
                                <Col span={12}>
                                    <div className="flex items-center">
                                        <UserOutlined className="mr-2" />
                                        <Text strong>Tên:</Text>
                                        <Text className="ml-1">{shop.fullName}</Text>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="flex items-center">
                                        <PhoneOutlined className="mr-2" />
                                        <Text strong>Số điện thoại:</Text>
                                        <Text className="ml-1">{shop.phone || "Chưa cung cấp"}</Text>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="flex items-center">
                                        <MailOutlined className="mr-2" />
                                        <Text strong>Email:</Text>
                                        <Text className="ml-1">{shop.email}</Text>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="flex items-center">
                                        <FieldTimeOutlined className="mr-2" />
                                        <Text strong>Trả lời trong:</Text>
                                        <Text className="ml-1">Vài giờ</Text>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </CardContainer>

                {/* Shop Products */}
                <CardContainer>
                    <Tabs defaultActiveKey="products">
                        <TabPane tab={`Tất Cả Sản Phẩm (${totalTool || 0})`} key="products">
                            <div className="mb-4 flex flex-wrap items-center justify-between">
                                <div className="flex items-center mb-2 sm:mb-0">
                                    <Text strong className="mr-2">Sắp xếp theo:</Text>
                                    <Select
                                        value={sortBy}
                                        onChange={(value) => setSortBy(value)}
                                        style={{ width: 150 }}
                                        className="mr-4"
                                    >
                                        <Option value="newest">Mới nhất</Option>
                                        <Option value="oldest">Cũ nhất</Option>
                                        <Option value="price-asc">Giá tăng dần</Option>
                                        <Option value="price-desc">Giá giảm dần</Option>
                                        <Option value="popular">Phổ biến nhất</Option>
                                    </Select>

                                    <Text strong className="mr-2 ml-2">Hiển thị:</Text>
                                    <Select
                                        value={pageSize}
                                        onChange={(value) => {
                                            setPageSize(value);
                                            setCurrentPage(1);
                                        }}
                                        style={{ width: 80 }}
                                    >
                                        <Option value={10}>10</Option>
                                        <Option value={20}>20</Option>
                                        <Option value={30}>30</Option>
                                    </Select>
                                </div>

                                <div className="flex items-center">
                                    <Input
                                        placeholder="Tìm sản phẩm..."
                                        prefix={<SearchOutlined />}
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        style={{ width: 200 }}
                                        allowClear
                                    />
                                </div>
                            </div>

                            {loadingProducts ? (
                                <div className="text-center py-8">
                                    <Spin tip="Đang tải sản phẩm..." />
                                </div>
                            ) : filteredProducts.length === 0 ? (
                                <Empty description="Không tìm thấy sản phẩm nào" />
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                        {filteredProducts
                                            .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                                            .map(product => (
                                                <ToolItem key={product.toolId} tool={product} />
                                            ))
                                        }
                                    </div>

                                    <div className="mt-6 flex justify-center">
                                        <Pagination
                                            current={currentPage}
                                            total={filteredProducts.length}
                                            pageSize={pageSize}
                                            onChange={setCurrentPage}
                                            showSizeChanger={false}
                                        />
                                    </div>
                                </>
                            )}
                        </TabPane>
                        <TabPane tab="Thông Tin Shop" key="info">
                            <div className="p-4">
                                <Title level={4}>Thông tin chi tiết về {shop.shopName}</Title>
                                <Divider />
                                <Row gutter={[16, 16]}>
                                    <Col span={24} md={12}>
                                        <Card title="Thông tin cửa hàng" bordered={false}>
                                            <p><strong>Tên shop:</strong> {shop.shopName}</p>
                                            <p><strong>Loại hình kinh doanh:</strong> {shop.businessType === "individual" ? "Cá nhân" : "Doanh nghiệp"}</p>
                                            <p><strong>Email liên hệ:</strong> {shop.billingEmail}</p>
                                            <p><strong>Mã số thuế:</strong> {shop.taxNumber}</p>
                                            <p><strong>Ngày tham gia:</strong> {formatJoinedTime(shop.createdAt)}</p>
                                        </Card>
                                    </Col>
                                    <Col span={24} md={12}>
                                        <Card title="Thống kê cửa hàng" bordered={false}>
                                            <p><strong>Tổng sản phẩm:</strong> {totalTool || 0}</p>
                                            <p><strong>Sản phẩm đã bán:</strong> {totalSoldTool || 0}</p>
                                            <p><strong>Tổng lượt đánh giá:</strong> {totalRated || 0}</p>
                                            <p><strong>Đánh giá trung bình:</strong> {ratingAverage} / 5</p>
                                            <p><strong>Tỉ lệ phản hồi:</strong> 95%</p>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </TabPane>
                    </Tabs>
                </CardContainer>
            </Content>
        </Layout>
    );
};

export default ShopDetailPage;