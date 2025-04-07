import { useEffect, useState } from "react";
import { Spin, Pagination, Empty, Alert } from "antd";
import ToolItem from "./ToolItem";
import { useParams } from "react-router-dom";
import { useCBFProduct } from "../hooks/useCBFProduct";
import SectionTitle from "../../../components/SectionTitle";
import { getToolsByToolIds } from "../../../services/ToolService";
import { useQueryClient } from "@tanstack/react-query";
import { use } from "react";

const SimilarProductList = ({ pageSize = 18 }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const { toolId } = useParams();
    const { cbf_tools, isLoading, error } = useCBFProduct(toolId, 18);
    const [sortedProducts, setSortedProducts] = useState([]);
    const useQuery = useQueryClient();
    useEffect(() => {
        useQuery.invalidateQueries(["cbf_product"]);
    }, [toolId]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                if (cbf_tools && cbf_tools.length > 0) {
                    // Lay ds toolId
                    const toolIds = cbf_tools.map(item => item.toolId);

                    // Lay danh sach san pham tu database
                    let result = await getToolsByToolIds(toolIds);
                    console.log("goi lai api tool result", result);

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
                console.error(err);
            }
        };

        fetchProducts();
    }, [cbf_tools]); // Add toolId to dependency array

    if (isLoading) {
        return (
            <div className="text-center py-6">
                <Spin tip="Đang tải dữ liệu sản phẩm..." size="large">
                    <div style={{ height: "200px" }} />
                </Spin>
            </div>
        );
    }

    if (error) {
        return <Alert
            message="Lỗi tải dữ liệu"
            description={error.message}
            type="error" showIcon
        />;
    }

    const products = sortedProducts || [];
    if (products?.length === 0) {
        return <Empty description="Không có sản phẩm nào" />;
    }

    return (
        <div className="p-8">
            <SectionTitle>Các sản phẩm tương tự</SectionTitle>
            {/* Danh sách sản phẩm */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {products?.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((tool) => (
                    <ToolItem key={tool?.toolId} similarProduct={tool} />
                ))}
            </div>

            {/* Phân trang */}
            <div className="mt-6 flex justify-center">
                <Pagination
                    current={currentPage}
                    total={products?.length}
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                />
            </div>
        </div>
    );
};

export default SimilarProductList;
