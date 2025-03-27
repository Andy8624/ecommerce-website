import { Button, Segmented } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetAllToolByUserId } from "../hooks/useGetAllToolByUserId";
import { useCreateTool } from "../hooks/useCreateTool";
import { useUpdateTool } from "../hooks/useUpdateTool";
import { useDeleteTool } from "../hooks/useDeleteTool";
import ProductTable from "./ProductTable";
import { useNavigate } from "react-router-dom";

const ProductManagement = () => {
    const userId = useSelector(state => state?.account?.user?.id);
    const { tools } = useGetAllToolByUserId(userId);
    console.log(tools);
    const { createNewTool } = useCreateTool();
    const { updateTool } = useUpdateTool();
    const { deleteTool, isDeleting } = useDeleteTool();
    const navigate = useNavigate();

    const [filter, setFilter] = useState("Tất cả");

    const handleCreateOrUpdate = () => {
        navigate("/seller/product-form");
    };

    const handleDelete = async (toolId) => {
        deleteTool(toolId);
    };

    const filteredTools = tools.filter((tool) => {
        if (filter === "Tất cả") return true;
        if (filter === "Thêm gần đây") return tool.isNew;
        if (filter === "Đã ẩn") return tool.isHidden;
        if (filter === "Đã hết hàng") return tool.isOutOfStock;
        return true;
    });

    return (
        <div className="p-3">
            <div className="flex justify-between items-center mb-3">
                <Segmented
                    options={["Tất cả", "Thêm gần đây", "Đã ẩn", "Đã hết hàng"]}
                    value={filter}
                    onChange={setFilter}
                    className="bg-gray-100 p-2 rounded-lg"
                />
                <Button onClick={handleCreateOrUpdate} type="primary">
                    Thêm sản phẩm
                </Button>
            </div>

            <ProductTable tools={filteredTools} onDelete={handleDelete} isDeleting={isDeleting} />
        </div>
    );
};

export default ProductManagement;
