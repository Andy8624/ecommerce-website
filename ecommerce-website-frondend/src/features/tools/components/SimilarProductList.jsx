import { useEffect, useState } from "react";
import { Spin, Pagination, Empty, Alert, Card, Typography, Divider, Tag } from "antd";
import ToolItem from "./ToolItem";
import { useParams } from "react-router-dom";
import { useCBFProduct } from "../hooks/useCBFProduct";
import SectionTitle from "../../../components/SectionTitle";
import { getToolsByToolIds, callGetToolByToolId } from "../../../services/ToolService";
import { useQueryClient } from "@tanstack/react-query";
import { TOOL_URL } from "../../../utils/Config";

const { Title, Text } = Typography;

const SimilarProductList = ({ pageSize = 18, showFindingProduct = true }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const { toolId } = useParams();
    const { cbf_tools, isLoading: isLoadingCBF, error: cbfError } = useCBFProduct(toolId, 100);
    const [sortedProducts, setSortedProducts] = useState([]);
    const [currentTool, setCurrentTool] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const queryClient = useQueryClient();

    useEffect(() => {
        queryClient.invalidateQueries(["cbf_product"]);
    }, [toolId, queryClient]);

    // Lấy thông tin current tool từ toolId trong params
    useEffect(() => {
        const fetchCurrentTool = async () => {
            if (!toolId) return;

            try {
                const toolData = await callGetToolByToolId(toolId);
                if (toolData) {
                    setCurrentTool(toolData);
                }
            } catch (err) {
                console.error("Error fetching current tool:", err);
                setError(err);
            }
        };

        fetchCurrentTool();
    }, [toolId]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                if (cbf_tools && cbf_tools.length > 0) {
                    // Lay ds toolId
                    const toolIds = cbf_tools.map(item => item.toolId);

                    // Lay danh sach san pham tu database
                    let result = await getToolsByToolIds(toolIds);

                    // Lay ds diem so san pham (diem cang cao cang tuong dong)
                    const scoreMap = cbf_tools.reduce((acc, item) => {
                        acc[item.toolId] = item.score;
                        return acc;
                    }, {});

                    // The score vao tung san pham
                    result = result.map(item => ({
                        ...item,
                        score: scoreMap[item.toolId] || 0
                    }));

                    // Sap xep san pham giam dan theo score
                    const sorted = [...result].sort((a, b) => b.score - a.score);
                    setSortedProducts(sorted);
                }
            } catch (err) {
                console.error("Error fetching similar products:", err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (cbf_tools) {
            fetchProducts();
        }
    }, [cbf_tools]);

    if (isLoading || isLoadingCBF) {
        return (
            <div className="text-center py-6">
                <Spin tip="Đang tải dữ liệu sản phẩm..." size="large">
                    <div style={{ height: "200px" }} />
                </Spin>
            </div>
        );
    }

    if (error || cbfError) {
        return <Alert
            message="Lỗi tải dữ liệu"
            description={(error || cbfError)?.message}
            type="error" showIcon
        />;
    }

    const products = sortedProducts || [];
    if (products?.length === 0 && !currentTool) {
        return <Empty description="Không có sản phẩm nào" />;
    }

    // Lấy các sản phẩm còn lại (không bao gồm currentTool)
    const remainingProducts = currentTool
        ? products.filter(p => p.toolId !== currentTool.toolId)
        : products;

    return (
        <div className="p-8">
            {/* Hiển thị sản phẩm hiện tại */}
            {(currentTool && showFindingProduct) && (
                <div className="mb-8">
                    <SectionTitle>
                        Sản phẩm đang tìm kiếm
                    </SectionTitle>
                    <Card className="bg-blue-50 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row items-center">
                            <div className="sm:w-1/4 mb-4 sm:mb-0 flex justify-center">
                                <img
                                    src={`${TOOL_URL}${currentTool.imageUrl}`}
                                    alt={currentTool.name}
                                    className="h-40 object-contain"
                                />
                            </div>
                            <div className="sm:w-3/4 sm:pl-6">
                                <Title level={4} className="text-blue-700">{currentTool.name}</Title>
                                <div className="flex items-center mb-2">
                                    <Text className="text-xl font-bold text-red-600">
                                        {currentTool.price?.toLocaleString('vi-VN')} đ
                                    </Text>
                                </div>
                                <div className="flex items-center mb-3">
                                    {currentTool.stockQuantity > 0 ? (
                                        <Tag color="green">Còn hàng</Tag>
                                    ) : (
                                        <Tag color="red">Hết hàng</Tag>
                                    )}
                                </div>
                                <p className="text-gray-700 line-clamp-2">
                                    {currentTool.description}
                                </p>
                            </div>
                        </div>
                    </Card>
                    <Divider className="my-6" />
                </div>
            )}


            <SectionTitle>Các sản phẩm tương tự</SectionTitle>

            {/* Danh sách sản phẩm còn lại */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 mt-4">
                {remainingProducts?.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((tool) => (
                    <ToolItem key={tool?.toolId} similarProduct={tool} />
                ))}
            </div>

            {/* Phân trang */}
            {remainingProducts.length > pageSize && (
                <div className="mt-6 flex justify-center">
                    <Pagination
                        current={currentPage}
                        total={remainingProducts?.length}
                        pageSize={pageSize}
                        onChange={setCurrentPage}
                        showSizeChanger={false}
                    />
                </div>
            )}
        </div>
    );
};

export default SimilarProductList;
