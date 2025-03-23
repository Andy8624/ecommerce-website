import { useState } from "react";
import { Spin, Pagination, Empty, Alert } from "antd";
import { useTools } from "../hooks/useTools";
import ToolItem from "./ToolItem";

const ToolList = ({ pageSize }) => {
    const { isLoading, error, tools } = useTools();
    const [currentPage, setCurrentPage] = useState(1);

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

    const products = tools || [];

    if (products.length === 0) {
        return <Empty description="Không có sản phẩm nào" />;
    }

    return (
        <div>
            {/* Danh sách sản phẩm */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {products.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((tool) => (
                    <ToolItem key={tool.toolId} tool={tool} />
                ))}
            </div>

            {/* Phân trang */}
            <div className="mt-6 flex justify-center">
                <Pagination
                    current={currentPage}
                    total={products.length}
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                />
            </div>
        </div>
    );
};

export default ToolList;
