import { PlusOutlined } from "@ant-design/icons";
import { Form, Input, Button, Table, Space } from "antd";
import { useState } from "react";

const SalesInfo = ({ form }) => {
    const [categories, setCategories] = useState([]);
    const [prices, setPrices] = useState([]);
    const [stocks, setStocks] = useState([]);

    const addCategory = () => {
        if (categories.length < 2) {
            setCategories([...categories, { name: "", values: [] }]);
        }
    };

    const updateCategoryName = (index, value) => {
        const newCategories = [...categories];
        newCategories[index].name = value;
        setCategories(newCategories);
    };

    const addCategoryValue = (index) => {
        const newCategories = [...categories];
        newCategories[index].values.push("");
        setCategories(newCategories);
    };

    const updateCategoryValue = (catIndex, valIndex, value) => {
        const newCategories = [...categories];
        newCategories[catIndex].values[valIndex] = value;
        setCategories(newCategories);
    };

    const generateCombinations = () => {
        if (categories.length === 0) return [];

        return categories.reduce((acc, category) => {
            if (acc.length === 0) return category.values.map(value => [value]);
            return acc.flatMap(prev => category.values.map(value => [...prev, value]));
        }, []);
    };

    const updatePrice = (index, value) => {
        const newPrices = [...prices];
        newPrices[index] = value;
        setPrices(newPrices);
    };

    const updateStock = (index, value) => {
        const newStocks = [...stocks];
        newStocks[index] = value;
        setStocks(newStocks);
    };

    const productVariants = generateCombinations();

    const columns = [
        ...categories.map((category, index) => ({
            title: category.name || `Phân loại ${index + 1}`,
            dataIndex: `category${index}`,
            key: `category${index}`
        })),
        {
            title: "Giá sản phẩm",
            dataIndex: "price",
            key: "price",
            render: (_, record, index) => (
                <Input
                    value={prices[index] || ""}
                    onChange={(e) => updatePrice(index, e.target.value)}
                    placeholder="Nhập giá sản phẩm"
                />
            )
        },
        {
            title: "Số lượng kho",
            dataIndex: "stock",
            key: "stock",
            render: (_, record, index) => (
                <Input
                    value={stocks[index] || ""}
                    onChange={(e) => updateStock(index, e.target.value)}
                    placeholder="Nhập số lượng kho"
                />
            )
        }
    ];

    const dataSource = productVariants.map((variant, index) => {
        const row = { key: index };
        variant.forEach((value, i) => {
            row[`category${i}`] = value;
        });
        return row;
    });

    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">Thông tin bán hàng</h2>
            {categories.length === 0 ? (
                <div className="mb-4 p-4 bg-gray-200 rounded-lg">
                    <Form.Item label="Giá sản phẩm">
                        <Input value={prices[0] || ""} onChange={(e) => updatePrice(0, e.target.value)} placeholder="Nhập giá sản phẩm" />
                    </Form.Item>
                    <Form.Item label="Số lượng kho">
                        <Input value={stocks[0] || ""} onChange={(e) => updateStock(0, e.target.value)} placeholder="Nhập số lượng sản phẩm trong kho" />
                    </Form.Item>
                </div>
            ) : (
                categories.map((category, catIndex) => (
                    <div key={catIndex} className="mb-4 p-4 bg-gray-200 rounded-lg">
                        <Form.Item label={`Phân loại ${catIndex + 1}`}>
                            <Input
                                value={category.name}
                                onChange={(e) => updateCategoryName(catIndex, e.target.value)}
                                placeholder="Nhập tên phân loại (VD: Màu sắc, Kích thước)"
                            />
                        </Form.Item>
                        <Space wrap>
                            {category.values.map((value, valIndex) => (
                                <Form.Item key={valIndex}>
                                    <Input
                                        value={value}
                                        onChange={(e) => updateCategoryValue(catIndex, valIndex, e.target.value)}
                                        placeholder="Nhập giá trị"
                                        style={{ width: 150 }}
                                    />
                                </Form.Item>
                            ))}
                        </Space>
                        <Button className="ms-2" type="dashed" onClick={() => addCategoryValue(catIndex)}>
                            <PlusOutlined /> Thêm giá trị
                        </Button>
                    </div>
                ))
            )}
            {categories.length < 2 && (
                <Button type="dashed" onClick={addCategory}>
                    <PlusOutlined /> Thêm phân loại
                </Button>
            )}
            {productVariants.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-md font-semibold mb-2">Giá và kho hàng cho từng biến thể</h3>
                    <Table dataSource={dataSource} columns={columns} pagination={false} />
                </div>
            )}
        </div>
    );
};

export default SalesInfo;