import { Table, Button } from "antd";
import { TOOL_URL } from "../../../utils/Config";

const ProductTable = ({ tools, onEdit, onDelete, isDeleting }) => {
    // console.log(tools)
    const columns = [
        {
            title: "Tên sản phẩm",
            dataIndex: "name",
            key: "name",
            className: "text-center",
            width: "10rem",
            align: "center",
        },
        {
            title: "Ảnh",
            dataIndex: "imageUrl",
            key: "imageUrl",
            width: "7rem",
            align: "center",
            render: (text) => text ?
                <img src={TOOL_URL + text} alt="Ảnh sản phẩm" className="w-20 h-20 object-cover rounded-lg shadow-sm" /> :
                <img src={TOOL_URL + "default.png"} alt="Ảnh sản phẩm" className="w-20 h-20 object-cover rounded-lg shadow-sm" />,
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            align: "center",
            render: (text) => (
                <span className="truncate max-w-64 inline-block" title={text}>
                    {text}
                </span>
            )
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            width: "6rem",
            align: "center",
            render: (text) => `${text.toLocaleString()}đ`
        },
        {
            title: "Giá khuyến mãi",
            dataIndex: "discountedPrice",
            key: "discountedPrice",
            width: "10rem",
            align: "center",
            render: (text) => text ? `${text.toLocaleString()}đ` : "Không có"
        },
        {
            title: "Số lượng",
            dataIndex: "stockQuantity",
            key: "stockQuantity",
            align: "center",
        },
        {
            title: "Loại",
            dataIndex: "toolType.name",
            key: "toolType.name",
            align: "center",
            width: "10rem",
            render: (text, tool) => (
                <span>{tool.toolType?.name}</span>
            ),
        },
        {
            title: "Thao tác",
            key: "action",
            align: "center",
            render: (text, tool) => (
                <div className="flex justify-center items-center space-x-2">
                    <Button onClick={() => onEdit(tool)} className="bg-green-500 hover:bg-green-600 text-white">
                        Sửa
                    </Button>
                    <Button disabled={isDeleting} onClick={() => onDelete(tool.toolId)} className="bg-red-500 hover:bg-red-600 text-white">
                        {isDeleting ? "Đang xóa" : "Xóa"}
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Table
            className="shadow-lg"
            dataSource={tools}
            rowKey="toolId"
            columns={columns}
            pagination={{ pageSize: 3 }}
        />
    );
};

export default ProductTable;
