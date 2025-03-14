import { useState, useEffect } from "react";
import { Form, Input, Button, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const DetailedInfo = ({ attributes, setAttributes }) => {
    // Lấy dữ liệu từ localStorage khi component mount
    useEffect(() => {
        const storedAttributes = localStorage.getItem("attributes");
        if (storedAttributes) {
            setAttributes(JSON.parse(storedAttributes));
        }
    }, []);

    // Cập nhật localStorage khi attributes thay đổi
    useEffect(() => {
        localStorage.setItem("attributes", JSON.stringify(attributes));
    }, [attributes]);

    const [newAttributeName, setNewAttributeName] = useState("");
    const [showAddAttributeInput, setShowAddAttributeInput] = useState(false);

    const updateAttributeValue = (index, value) => {
        const newAttributes = [...attributes];
        newAttributes[index].value = value;
        setAttributes(newAttributes);
    };

    const addAttribute = () => {
        if (newAttributeName && !attributes.some(attr => attr.name === newAttributeName)) {
            setAttributes([...attributes, { name: newAttributeName, value: "" }]);
            setNewAttributeName("");
            setShowAddAttributeInput(false); // Ẩn input sau khi thêm
        }
    };

    const removeAttribute = (index) => {
        const newAttributes = attributes.filter((_, i) => i !== index);
        setAttributes(newAttributes);
    };

    return (
        <div>
            <Form.Item label="Tên thương hiệu" name="brand"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 8 }}
                required
                rules={[{ required: true, message: "Vui lòng nhập thương hiệu" }]}
            >
                <Input placeholder="Nhập thông tin thương hiệu" />
            </Form.Item>
            <Form.Item label="Bảo hành" name="warranty"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 8 }}
                required
                rules={[{ required: true, message: "Vui lòng nhập thời hạn bảo hành" }]}
            >
                <Input placeholder="Nhập thông tin bảo hành" />
            </Form.Item>
            <Form.Item label="Xuất xứ" name="origin"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 8 }}
                required
                rules={[{ required: true, message: "Vui lòng nhập nguồn gốc xuất xứ" }]}
            >
                <Input placeholder="Nhập thông tin nguồn gốc xuất xứ" />
            </Form.Item>
            {attributes?.map((attr, index) => (
                <Form.Item key={index} label={attr.name} name={attr.name}
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 8 }}
                    required
                    rules={[{ required: true, message: `Vui lòng nhập ${attr.name.toLowerCase()}` }]}
                >
                    <div className="flex items-center">
                        <Input
                            placeholder={`Nhập thông tin ${attr.name.toLowerCase()}`}
                            value={attr.value}
                            onChange={(e) => updateAttributeValue(index, e.target.value)}
                        />
                        <DeleteOutlined
                            className="text-red-400 hover:bg-red-200 rounded-full p-1 text-sm transition-colors duration-200 ease-in-out"
                            onClick={() => removeAttribute(index)}
                        />
                    </div>
                </Form.Item>
            ))}

            <Space className="mt-6">
                {!showAddAttributeInput && (
                    <Button type="dashed" onClick={() => setShowAddAttributeInput(true)} variant="outlined" color="primary">
                        <PlusOutlined /> Thêm thuộc tính
                    </Button>
                )}

                {showAddAttributeInput && (
                    <>
                        <Input
                            placeholder="Nhập tên thuộc tính mới"
                            value={newAttributeName}
                            onChange={(e) => setNewAttributeName(e.target.value)}
                        />
                        <Button type="dashed" onClick={addAttribute} variant="outlined" color="primary">
                            <PlusOutlined /> Thêm
                        </Button>
                    </>
                )}
            </Space>
        </div>
    );
};

export default DetailedInfo;
