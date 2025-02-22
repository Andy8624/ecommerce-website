import { Table, Button, Dropdown } from "antd";
import { TOOL_URL } from "../../../utils/Config";
import { useState } from "react";

const ProductTable = ({ tools, onEdit, onDelete, isDeleting }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const columns = [
        {
            title: "Sản phẩm",
            key: "product",
            dataIndex: ["imageUrl", "name"],
            align: "center",
            width: "24rem",
            filters: tools?.map(tool => ({ text: tool.name, value: tool.name })),
            onFilter: (value, record) => record.name.includes(value),
            render: (_, record) => (
                <div className="flex items-center space-x-3">
                    <img
                        src={record.imageUrl ? TOOL_URL + record.imageUrl : TOOL_URL + "default.png"}
                        alt={record.name}
                        className="w-12 h-12 object-cover rounded-lg shadow-sm"
                    />
                    <span className="font-medium">{record.name}</span>
                </div>
            )
        },
        {
            title: "Giá (Khuyến mãi)",
            dataIndex: ["price", "discountedPrice"],
            key: "price_discountedPrice",
            width: "10rem",
            align: "center",
            render: (_, record) => (
                record.discountedPrice ? (
                    <div>
                        <span className="line-through text-gray-500">{record.price.toLocaleString()}đ</span>
                        <br />
                        <span className="text-red-500 font-semibold">{record.discountedPrice.toLocaleString()}đ</span>
                    </div>
                ) : (
                    <span>{record.price.toLocaleString()}đ</span>
                )
            )
        },
        {
            title: "Kho hàng",
            dataIndex: "stockQuantity",
            key: "stockQuantity",
            align: "center",
        },
        {
            title: "Loại",
            dataIndex: ["toolType", "name"],
            key: "toolType.name",
            align: "center",
            width: "10rem",
            filters: tools?.map(tool => tool.toolType?.name).filter((v, i, a) => a.indexOf(v) === i).map(name => ({ text: name, value: name })),
            onFilter: (value, record) => record.toolType?.name === value,
        },
        {
            title: "Thao tác",
            key: "action",
            align: "center",
            render: (_, tool) => {
                const items = [
                    {
                        key: "hide",
                        label: (
                            <Button type="link" className="text-gray-500 hover:text-gray-700">
                                Ẩn sản phẩm
                            </Button>
                        ),
                    },
                    {
                        key: "delete",
                        label: (
                            <Button
                                type="link"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => onDelete(tool.toolId)}
                                loading={isDeleting}
                            >
                                Xóa sản phẩm
                            </Button>
                        ),
                    },
                    {
                        key: "preview",
                        label: (
                            <Button type="link" className="text-blue-500 hover:text-blue-700">
                                Xem trước
                            </Button>
                        ),
                    },
                    {
                        key: "stockReminder",
                        label: (
                            <Button type="link" className="text-yellow-500 hover:text-yellow-700">
                                Nhắc nhở tồn kho
                            </Button>
                        ),
                    },
                ];

                return (
                    <div className="flex flex-col items-center space-y-1">
                        {/* Nút Cập nhật */}
                        <Button type="link" onClick={() => onEdit(tool)}
                            className="text-blue-600">
                            Cập nhật
                        </Button>

                        {/* Nút Xem thêm (Dropdown) - Không có mũi tên */}
                        <Dropdown menu={{ items }} trigger={["click"]}>
                            <Button type="link" className="text-blue-600">
                                Xem thêm
                            </Button>
                        </Dropdown>
                    </div>
                );
            },
        }



    ];

    return (
        <Table
            className="shadow-lg"
            dataSource={tools}
            rowKey="toolId"
            columns={columns}
            pagination={{ pageSize: 3 }}
            expandable={{ expandedRowRender: (record) => <p className="p-4">{record.description}</p> }}
            rowSelection={rowSelection}
        />
    );
};

export default ProductTable;
