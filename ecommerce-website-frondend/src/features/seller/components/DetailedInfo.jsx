import { useState } from "react";
import { Form, Input, Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const DetailedInfo = ({ form }) => {
    const [attributes, setAttributes] = useState([]);
    const [currentAttribute, setCurrentAttribute] = useState("");

    const addAttribute = () => {
        if (currentAttribute && !attributes.some(attr => attr.name === currentAttribute)) {
            setAttributes([...attributes, { name: currentAttribute, value: "" }]);
            setCurrentAttribute("");
        }
    };

    const updateAttributeValue = (index, value) => {
        const newAttributes = [...attributes];
        newAttributes[index].value = value;
        setAttributes(newAttributes);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-3">Thông tin chi tiết</h2>
            <Form.Item label="Tên thương hiệu" name="brand">
                <Input />
            </Form.Item>

            {attributes.map((attr, index) => (
                <Form.Item key={index} label={attr.name} name={attr.name}>
                    <Input
                        placeholder={`Nhập thông tin ${attr.name}`}
                        value={attr.value}
                        onChange={(e) => updateAttributeValue(index, e.target.value)}
                    />
                </Form.Item>
            ))}

            <Space>
                <Input
                    placeholder="Nhập thuộc tính mới"
                    value={currentAttribute}
                    onChange={(e) => setCurrentAttribute(e.target.value)}
                />
                <Button type="dashed" onClick={addAttribute} variant="outlined" color="primary">
                    <PlusOutlined /> Thêm thông tin chi tiết
                </Button>
            </Space>
        </div>
    );
};

export default DetailedInfo;
