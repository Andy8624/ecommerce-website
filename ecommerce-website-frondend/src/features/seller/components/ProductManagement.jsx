import { Button } from "antd";
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

    const { createNewTool } = useCreateTool();
    const { updateTool } = useUpdateTool();
    const { deleteTool, isDeleting } = useDeleteTool();

    const navigate = useNavigate();

    const handleCreateOrUpdate = () => {
        navigate("/seller/product-form");
    };

    const handleEdit = (tool) => {
    };

    const handleDelete = async (toolId) => {
        deleteTool(toolId);
    };


    return (
        <div className="p-3">
            <h1 className="text-2xl font-semibold mb-3 text-center">Quản lý sản phẩm</h1>
            <Button onClick={handleCreateOrUpdate} type="primary" className="mb-3">
                Thêm sản phẩm
            </Button>

            <ProductTable tools={tools} onEdit={handleEdit} onDelete={handleDelete} isDeleting={isDeleting} />

            {/* <ProductForm
                userId={userId}
                onSubmit={handleCreateOrUpdate}
            /> */}
        </div >
    );
};

export default ProductManagement;
