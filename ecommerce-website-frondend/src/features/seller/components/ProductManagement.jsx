import { Button } from "antd";
import { useSelector } from "react-redux";
import { useGetAllToolByUserId } from "../hooks/useGetAllToolByUserId";
import { useCreateTool } from "../hooks/useCreateTool";
import { useUpdateTool } from "../hooks/useUpdateTool";
import { useDeleteTool } from "../hooks/useDeleteTool";
import { useGetAllToolType } from "../hooks/useGetAllToolType";
import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";
import { useState } from "react";

const ProductManagement = () => {
    const userId = useSelector(state => state?.account?.user?.id);
    const { tools } = useGetAllToolByUserId(userId);
    const { createNewTool } = useCreateTool();
    const { updateTool } = useUpdateTool();
    const { deleteTool, isDeleting } = useDeleteTool();
    const { toolTypes, isLoading: isToolTypesLoading } = useGetAllToolType();

    const [editingTool, setEditingTool] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleCreateOrUpdate = async (toolData) => {
        if (editingTool) {
            updateTool({ toolId: editingTool.toolId, updatedTool: toolData });
        } else {
            createNewTool(toolData);
        }
        setIsModalVisible(false);
        setEditingTool(null);
    };

    const handleEdit = (tool) => {
        setEditingTool(tool);
        setIsModalVisible(true);
    };

    const handleDelete = async (toolId) => {
        deleteTool(toolId);
    };

    const openCreateModal = () => {
        setEditingTool(null);
        setIsModalVisible(true);
    };

    return (
        <div className="p-3">
            <h1 className="text-2xl font-semibold mb-3 text-center">Quản lý sản phẩm</h1>
            <Button onClick={openCreateModal} type="primary" className="mb-3">
                Thêm sản phẩm
            </Button>
            <ProductTable tools={tools} onEdit={handleEdit} onDelete={handleDelete} isDeleting={isDeleting} />
            <ProductForm
                userId={userId}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onSubmit={handleCreateOrUpdate}
                editingTool={editingTool}
                toolTypes={toolTypes}
                isToolTypesLoading={isToolTypesLoading}
            />
        </div >
    );
};

export default ProductManagement;
