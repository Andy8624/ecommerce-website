import { useState, useEffect } from "react";
import { Layout, Spin, Pagination, Empty, Alert, Select, Row, Col, Input, Button } from "antd";
import { useLocation, useParams } from "react-router-dom";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { getAllToolByToolTypeId } from "../services/ToolService";
import ToolItem from "../features/tools/components/ToolItem";
import SectionTitle from "../components/SectionTitle";
import CardContainer from "../components/CardContainer";

const { Content } = Layout;
const { Option } = Select;

const TypeProductListPage = () => {
    const location = useLocation();
    const { typeId } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [sortBy, setSortBy] = useState("newest");
    const [priceRange, setPriceRange] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Lấy thông tin danh mục từ state hoặc từ params
    const toolTypeName = location.state?.toolTypeName || "Danh mục sản phẩm";
    const toolTypeId = location.state?.toolTypeId || typeId;

    // Fetch sản phẩm theo danh mục
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const result = await getAllToolByToolTypeId(toolTypeId);
                setProducts(result || []);
                setFilteredProducts(result || []);
                setError(null);
            } catch (err) {
                console.error("Lỗi khi tải sản phẩm:", err);
                setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        if (toolTypeId) {
            fetchProducts();
        }
    }, [toolTypeId]);

    // Xử lý lọc và sắp xếp sản phẩm
    useEffect(() => {
        if (!products.length) return;

        let result = [...products];

        // Lọc theo từ khóa
        if (searchKeyword.trim()) {
            const keyword = searchKeyword.toLowerCase();
            result = result.filter(product =>
                product.name.toLowerCase().includes(keyword)
            );
        }

        // Lọc theo khoảng giá
        if (priceRange) {
            const [min, max] = priceRange;
            result = result.filter(product =>
                product.price >= min && (max === 0 || product.price <= max)
            );
        }

        // Sắp xếp
        switch (sortBy) {
            case "newest":
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case "price-asc":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                result.sort((a, b) => b.price - a.price);
                break;
            case "popular":
                // Sắp xếp theo số lượng đã bán (nếu có)
                result.sort((a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0));
                break;
            case "rating":
                // Sắp xếp theo đánh giá (nếu có)
                result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
                break;
            default:
                break;
        }

        setFilteredProducts(result);
        setCurrentPage(1); // Reset về trang đầu tiên khi lọc
    }, [products, sortBy, priceRange, searchKeyword]);

    // Xử lý reset bộ lọc
    const handleResetFilters = () => {
        setSortBy("newest");
        setPriceRange(null);
        setSearchKeyword("");
    };

    // Xử lý chọn khoảng giá
    const handlePriceRangeChange = (value) => {
        switch (value) {
            case "0-50000":
                setPriceRange([0, 50000]);
                break;
            case "50000-100000":
                setPriceRange([50000, 100000]);
                break;
            case "100000-500000":
                setPriceRange([100000, 500000]);
                break;
            case "500000-0":
                setPriceRange([500000, 0]); // 0 đại diện cho không giới hạn
                break;
            default:
                setPriceRange(null);
                break;
        }
    };

    // Hiển thị trạng thái loading
    if (loading) {
        return (
            <Layout style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
                <Content style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
                    <div className="text-center py-20">
                        <Spin tip={`Đang tải sản phẩm ${toolTypeName}...`} size="large" />
                    </div>
                </Content>
            </Layout>
        );
    }

    // Hiển thị lỗi
    if (error) {
        return (
            <Layout style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
                <Content style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
                    <Alert message="Lỗi" description={error} type="error" showIcon />
                </Content>
            </Layout>
        );
    }

    return (
        <Layout style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            <Content style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
                {/* Tiêu đề và thông tin */}
                <CardContainer>
                    <SectionTitle>Loại sản phẩm: {toolTypeName}</SectionTitle>
                    <p className="text-gray-500 mb-4">
                        Tìm thấy: {filteredProducts.length} sản phẩm
                    </p>
                </CardContainer>

                {/* Bộ lọc */}
                <CardContainer>
                    <div className="mb-6">
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} md={6}>
                                <Input
                                    placeholder="Tìm kiếm trong danh mục này"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    prefix={<SearchOutlined />}
                                    allowClear
                                />
                            </Col>
                            <Col xs={12} md={5}>
                                <div className="flex items-center">
                                    <span className="mr-2 whitespace-nowrap">Sắp xếp:</span>
                                    <Select
                                        value={sortBy}
                                        onChange={(value) => setSortBy(value)}
                                        style={{ width: '100%' }}
                                    >
                                        <Option value="newest">Mới nhất</Option>
                                        <Option value="price-asc">Giá tăng dần</Option>
                                        <Option value="price-desc">Giá giảm dần</Option>
                                        <Option value="popular">Bán chạy</Option>
                                        <Option value="rating">Đánh giá</Option>
                                    </Select>
                                </div>
                            </Col>
                            <Col xs={12} md={5}>
                                <div className="flex items-center">
                                    <span className="mr-2 whitespace-nowrap">Giá:</span>
                                    <Select
                                        placeholder="Chọn khoảng giá"
                                        style={{ width: '100%' }}
                                        onChange={handlePriceRangeChange}
                                        value={priceRange ? `${priceRange[0]}-${priceRange[1]}` : undefined}
                                        allowClear
                                    >
                                        <Option value="0-50000">Dưới 50.000đ</Option>
                                        <Option value="50000-100000">50.000đ - 100.000đ</Option>
                                        <Option value="100000-500000">100.000đ - 500.000đ</Option>
                                        <Option value="500000-0">Trên 500.000đ</Option>
                                    </Select>
                                </div>
                            </Col>
                            <Col xs={12} md={4}>
                                <div className="flex items-center">
                                    <span className="mr-2 whitespace-nowrap">Hiển thị:</span>
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
                            </Col>
                            <Col xs={12} md={4}>
                                <Button
                                    icon={<ReloadOutlined />}
                                    onClick={handleResetFilters}
                                >
                                    Đặt lại
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </CardContainer>

                {/* Danh sách sản phẩm */}
                <CardContainer>
                    {filteredProducts.length === 0 ? (
                        <Empty
                            description={`Không tìm thấy sản phẩm nào trong danh mục ${toolTypeName} phù hợp với bộ lọc.`}
                            className="py-10"
                        />
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {filteredProducts
                                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                                    .map((tool) => (
                                        <ToolItem key={tool.toolId} tool={tool} />
                                    ))
                                }
                            </div>

                            <div className="mt-8 flex justify-center">
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
                </CardContainer>
            </Content>
        </Layout>
    );
};

export default TypeProductListPage;