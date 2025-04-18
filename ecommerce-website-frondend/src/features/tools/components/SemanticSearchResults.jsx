import { useState } from "react";
import { Pagination, Empty, Alert, Divider, Tag, Typography } from "antd";
import { useLocation } from 'react-router-dom';
import ToolItem from "./ToolItem";
import SectionTitle from "../../../components/SectionTitle";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

const SemanticSearchResults = ({ pageSize = 18 }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const location = useLocation();
    const searchResults = location.state?.searchResults;
    const query = location.state?.query || "";

    if (!searchResults) {
        return <Alert
            message="Không có dữ liệu tìm kiếm"
            description="Vui lòng thực hiện tìm kiếm lại"
            type="info"
            showIcon
        />;
    }

    const products = searchResults.results || [];

    if (products.length === 0) {
        return <Empty description="Không tìm thấy sản phẩm nào phù hợp" />;
    }

    // Nhóm sản phẩm theo matchType
    const exactMatches = products.filter(p => p.matchType === "exact");
    const semanticMatches = products.filter(p => p.matchType === "semantic");

    // Hiển thị sản phẩm theo trang hiện tại
    const handleGetPageData = () => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return products.slice(startIndex, endIndex);
    };

    return (
        <div className="p-7">
            <div className="mb-6">
                <Title level={3} className="mb-2">Kết quả tìm kiếm ngữ nghĩa</Title>
                <div className="flex items-center mb-4">
                    <Text className="text-lg mr-2">Từ khóa:</Text>
                    <Tag color="blue" className="text-base px-3 py-1">
                        {query}
                    </Tag>
                </div>
                <Alert
                    icon={<InfoCircleOutlined />}
                    message="Tìm kiếm ngữ nghĩa"
                    description="Tìm kiếm ngữ nghĩa giúp bạn tìm được các sản phẩm liên quan đến ngữ cảnh của từ khóa, không chỉ dựa trên từng từ riêng lẻ."
                    type="info"
                    showIcon
                    className="mb-4"
                />
            </div>

            {exactMatches.length > 0 && (
                <div className="mb-6">
                    <SectionTitle>Kết quả chính xác ({exactMatches.length})</SectionTitle>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-4">
                        {exactMatches.slice(0, 6).map((product) => (
                            <ToolItem
                                key={product.toolId}
                                tool={{
                                    toolId: product.toolId,
                                    name: product.name,
                                    price: product.price,
                                    imageUrl: product.imageUrl,
                                    toolType: product.toolType
                                }}
                                score={product.score}
                                isExactMatch={true}
                            />
                        ))}
                    </div>
                    {/* {exactMatches.length > 6 && (
                        <div className="text-center">
                            <span className="text-blue-500 cursor-pointer hover:underline">
                                Xem thêm {exactMatches.length - 6} sản phẩm khác
                            </span>
                        </div>
                    )} */}
                </div>
            )}

            {semanticMatches.length > 0 && (
                <div className="mb-6">
                    <SectionTitle>Kết quả liên quan ({semanticMatches.length})</SectionTitle>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                        {semanticMatches.slice(0, 12).map((product) => (
                            <ToolItem
                                key={product.toolId}
                                tool={{
                                    toolId: product.toolId,
                                    name: product.name,
                                    price: product.price,
                                    imageUrl: product.imageUrl,
                                    toolType: product.toolType
                                }}
                                score={product.score}
                            />
                        ))}
                    </div>
                </div>
            )}

            <Divider className="my-4" />

            <SectionTitle>Tất cả kết quả</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {handleGetPageData().map((product) => (
                    <ToolItem
                        key={product.toolId}
                        tool={{
                            toolId: product.toolId,
                            name: product.name,
                            price: product.price,
                            imageUrl: product.imageUrl,
                            toolType: product.toolType
                        }}
                        score={product.score}
                        isExactMatch={product.matchType === "exact"}
                    />
                ))}
            </div>

            {products.length > pageSize && (
                <div className="mt-6 flex justify-center">
                    <Pagination
                        current={currentPage}
                        total={products.length}
                        pageSize={pageSize}
                        onChange={setCurrentPage}
                        showSizeChanger={false}
                    />
                </div>
            )}
        </div>
    );
};

export default SemanticSearchResults;