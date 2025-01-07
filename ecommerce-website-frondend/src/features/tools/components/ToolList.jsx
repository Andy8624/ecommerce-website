import { useState } from "react";
import { Spin, Pagination } from "antd";
import { useTools } from "../hooks/useTools";
import ToolItem from "./ToolItem";

const ToolList = ({ pageSize }) => {
    const { isLoading, error, tools } = useTools();
    const [currentPage, setCurrentPage] = useState(1);

    if (isLoading) {
        return (
            <div className="text-center py-6">
                <Spin tip="Đang tải dữ liệu sản phẩm..." size="large">
                    <div />
                </Spin>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center">Đã xảy ra lỗi: {error.message}</div>;
    }

    const products = tools?.result || [];

    if (products.length === 0) {
        return <div className="text-center">Không có sản phẩm nào.</div>;
    }

    // Tính toán dữ liệu sản phẩm cho trang hiện tại
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = products.slice(startIndex, endIndex);

    return (
        <div>
            {/* Danh sách sản phẩm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {paginatedProducts.map((tool) => (
                    <ToolItem key={tool.toolId} tool={tool} />
                ))}
            </div>

            {/* Phân trang */}
            <div className="mt-6 flex justify-center">
                <Pagination
                    current={currentPage} // Trang hiện tại
                    total={products.length} // Tổng số sản phẩm
                    pageSize={pageSize} // Số sản phẩm mỗi trang
                    onChange={(page) => setCurrentPage(page)} // Thay đổi trang
                />
            </div>
        </div>
    );
};

export default ToolList;
