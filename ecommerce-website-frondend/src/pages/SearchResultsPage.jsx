import { useState, useEffect } from "react";
import { Layout, Breadcrumb, Pagination, Empty, Select, Row, Col } from "antd";
import { useLocation, Link } from "react-router-dom";
import { HomeOutlined, FilterOutlined } from "@ant-design/icons";
import ToolItem from "../features/tools/components/ToolItem";
import SectionTitle from "../components/SectionTitle";
import CardContainer from "../components/CardContainer";

const { Content } = Layout;
const { Option } = Select;

const SearchResultsPage = () => {
    const location = useLocation();
    const [searchResults, setSearchResults] = useState([]);
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [sortBy, setSortBy] = useState("relevance");
    const [filteredResults, setFilteredResults] = useState([]);
    const [priceRange, setPriceRange] = useState(null);

    // Nhận kết quả tìm kiếm từ state
    useEffect(() => {
        if (location.state) {
            const { searchResults: results, query: searchQuery } = location.state;
            setSearchResults(results || []);
            setFilteredResults(results || []);
            setQuery(searchQuery || '');
        }
    }, [location.state]);

    // Xử lý lọc và sắp xếp kết quả
    useEffect(() => {
        if (searchResults.length === 0) return;

        let results = [...searchResults];

        // Lọc theo khoảng giá
        if (priceRange) {
            const [min, max] = priceRange;
            results = results.filter(product =>
                product.price >= min && (max === 0 || product.price <= max)
            );
        }

        // Sắp xếp
        switch (sortBy) {
            case "price-asc":
                results.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                results.sort((a, b) => b.price - a.price);
                break;
            case "newest":
                results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case "popular":
                // Sắp xếp theo số lượng đã bán (nếu có)
                results.sort((a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0));
                break;
            case "relevance":
            default:
                // Giữ nguyên thứ tự mặc định từ API (đã sắp xếp theo độ liên quan)
                break;
        }

        setFilteredResults(results);
        setCurrentPage(1); // Reset về trang đầu tiên khi lọc hoặc sắp xếp
    }, [searchResults, sortBy, priceRange]);

    // Xử lý thay đổi khoảng giá
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

    return (
        <Layout style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            <Content style={{ maxWidth: "80%", margin: "0 auto", padding: "20px" }}>
                {/* Tiêu đề tìm kiếm và số lượng kết quả */}
                <CardContainer>
                    <SectionTitle>Kết quả tìm kiếm cho &quot;{query}&quot;</SectionTitle>
                    <p className="text-gray-500">
                        Tìm thấy {filteredResults.length} sản phẩm
                    </p>
                </CardContainer>

                {/* Bộ lọc và sắp xếp */}
                <CardContainer>
                    <Row gutter={[16, 16]} align="middle" className="mb-6">
                        <Col xs={24} md={8} lg={6}>
                            <div className="flex items-center">
                                <FilterOutlined className="mr-2" />
                                <span className="mr-2">Sắp xếp theo:</span>
                                <Select
                                    value={sortBy}
                                    onChange={(value) => setSortBy(value)}
                                    style={{ flex: 1 }}
                                >
                                    <Option value="relevance">Liên quan</Option>
                                    <Option value="price-asc">Giá tăng dần</Option>
                                    <Option value="price-desc">Giá giảm dần</Option>
                                    <Option value="newest">Mới nhất</Option>
                                    <Option value="popular">Phổ biến nhất</Option>
                                </Select>
                            </div>
                        </Col>
                        <Col xs={24} md={8} lg={6}>
                            <div className="flex items-center">
                                <FilterOutlined className="mr-2" />
                                <span className="mr-2">Giá:</span>
                                <Select
                                    placeholder="Chọn khoảng giá"
                                    style={{ flex: 1 }}
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
                        <Col xs={24} md={8} lg={6}>
                            <div className="flex items-center">
                                <span className="mr-2">Hiển thị:</span>
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
                    </Row>
                </CardContainer>

                {/* Danh sách sản phẩm */}
                <CardContainer>
                    {filteredResults.length === 0 ? (
                        <Empty
                            description={`Không tìm thấy sản phẩm nào cho từ khóa "${query}"`}
                            className="py-10"
                        />
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {filteredResults
                                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                                    .map((product) => (
                                        <ToolItem key={product.toolId} tool={product} />
                                    ))
                                }
                            </div>

                            {filteredResults.length > pageSize && (
                                <div className="mt-8 flex justify-center">
                                    <Pagination
                                        current={currentPage}
                                        total={filteredResults.length}
                                        pageSize={pageSize}
                                        onChange={setCurrentPage}
                                        showSizeChanger={false}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </CardContainer>
            </Content>
        </Layout>
    );
};

export default SearchResultsPage;