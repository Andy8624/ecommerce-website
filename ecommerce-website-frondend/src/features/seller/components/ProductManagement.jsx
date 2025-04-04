import { Button, Segmented } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetAllToolByUserId } from "../hooks/useGetAllToolByUserId";
import { useDeleteTool } from "../hooks/useDeleteTool";
import ProductTable from "./ProductTable";
import { useNavigate } from "react-router-dom";

const ProductManagement = () => {
    const userId = useSelector(state => state?.account?.user?.id);
    const { tools } = useGetAllToolByUserId(userId);
    const { deleteTool, isDeleting } = useDeleteTool();
    const navigate = useNavigate();

    const [filter, setFilter] = useState("Tất cả");

    const handleCreateOrUpdate = () => {
        navigate("/seller/product-form");
    };

    const handleDelete = async (toolId) => {
        deleteTool(toolId);
    };

    const isNewProduct = (createdAt, countDay) => {
        const createdDate = new Date(createdAt);
        const today = new Date(); // Ngày hiện tại
        const diffTime = today - createdDate; // Số mili-giây giữa hai ngày
        const diffDays = diffTime / (1000 * 60 * 60 * 24); // Chuyển mili-giây sang ngày

        return diffDays <= countDay; // Kiểm tra nếu sản phẩm được tạo trong vòng CountDay ngày
    };

    const filteredTools = tools?.filter((tool) => {
        if (filter === "Tất cả") return true;
        if (filter === "Thêm gần đây") return isNewProduct(tool?.createdAt, 2);
        if (filter === "Đã ẩn") return !tool?.is_active;
        if (filter === "Đang hoạt động") return tool?.is_active;
        if (filter === "Đã hết hàng") return tool?.stockQuantity === 0;
        return true;
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <Segmented
                    options={["Tất cả", "Thêm gần đây", "Đang hoạt động", "Đã ẩn", "Đã hết hàng"]}
                    value={filter}
                    onChange={setFilter}
                    className="rounded-lg p-2 shadow-md border border-gray-300"
                />

                <Button onClick={handleCreateOrUpdate} type="primary">
                    Thêm sản phẩm
                </Button>
            </div>

            <ProductTable
                tools={filteredTools} onDelete={handleDelete} isDeleting={isDeleting} />
        </div>
    );
};

export default ProductManagement;
