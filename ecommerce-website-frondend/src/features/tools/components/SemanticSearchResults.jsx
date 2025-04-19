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
    const [isClosed, setIsClosed] = useState(false);
    const handleClose = () => {
        setIsClosed(true);
    };
    const searchResults = location.state?.searchResults;
    console.log("searchResults", searchResults);
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

    // Sắp xếp các sản phẩm theo điểm số (score) giảm dần
    const sortedProducts = [...products].sort((a, b) => b.score - a.score);

    return (
        <div className="p-7">
            <div className="mb-6">
                <Title level={3} className="mb-2">Kết quả tìm kiếm ngữ nghĩa</Title>
                <div className="flex items-center mb-4">
                    <Text className="text-lg mr-2">Từ khóa:</Text>
                    <Tag color="blue" className="text-base px-3 py-1">
                        {query}
                    </Tag>
                    <Text className="ml-4">Tìm thấy {products.length} sản phẩm</Text>
                </div>
                {!isClosed && <Alert
                    icon={<InfoCircleOutlined />}
                    message="Tìm kiếm ngữ nghĩa"
                    description="Công nghệ tìm kiếm ngữ nghĩa hiểu được ý định tìm kiếm của bạn, giúp hiển thị các sản phẩm liên quan dựa trên ngữ cảnh và ý nghĩa chứ không chỉ từng từ khóa đơn lẻ. Kết quả được sắp xếp theo mức độ liên quan nhất với nhu cầu thực tế của bạn." type="info"
                    showIcon
                    className="mb-4"
                    action={
                        <button
                            className="text-blue-500 hover:text-blue-700 bg-white px-2 border border-blue-500 rounded hover:bg-blue-100 transition duration-300"
                            onClick={handleClose}
                        >
                            Đóng
                        </button>
                    }
                />}
            </div>

            {/* Hiển thị các sản phẩm có điểm số cao nhất ở đầu */}
            {sortedProducts.length > 0 && (
                <div className="mb-6">
                    <SectionTitle>Kết quả tìm kiếm hàng đầu</SectionTitle>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-4">
                        {sortedProducts.slice(0, 6).map((product) => (
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
                                isHighlight={true}
                            />
                        ))}
                    </div>
                </div>
            )}

            {sortedProducts.length > 6 && (
                <>
                    <Divider className="my-4" />

                    <SectionTitle>Các kết quả khác</SectionTitle>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                        {sortedProducts.slice(6).slice((currentPage - 1) * pageSize, currentPage * pageSize).map((product) => (
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
                </>
            )}

            {sortedProducts.length > 6 + pageSize && (
                <div className="mt-6 flex justify-center">
                    <Pagination
                        current={currentPage}
                        total={sortedProducts.length - 6} // Trừ 6 sản phẩm đã hiển thị ở phần đầu
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