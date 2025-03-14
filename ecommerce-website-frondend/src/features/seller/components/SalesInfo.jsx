import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Form, Input, Button, Table, Space } from "antd";
import { useState } from "react";

const SalesInfo = ({
    categories, setCategories,
    prices, setPrices,
    stocks, setStocks,
    productVariants, dataSource,
}) => {


    const addCategory = () => {
        if (categories.length < 2) {
            setCategories([...categories, { name: "", values: [] }]);
        }
    };

    const removeCategory = (index) => {
        const newCategories = [...categories];
        newCategories.splice(index, 1);
        setCategories(newCategories);
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

    const removeCategoryValue = (catIndex, valIndex) => {
        const newCategories = [...categories];
        newCategories[catIndex].values.splice(valIndex, 1);
        setCategories(newCategories);
    };

    const updateCategoryValue = (catIndex, valIndex, value) => {
        const newCategories = [...categories];
        newCategories[catIndex].values[valIndex] = value;
        setCategories(newCategories);
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
                <Form.Item name={`price_${index}`} required>
                    <Input required
                        value={prices[index] || ""}
                        onChange={(e) => updatePrice(index, e.target.value)}
                        placeholder="Nhập giá sản phẩm"
                    />
                </Form.Item>
            )
        },
        {
            title: "Số lượng kho",
            dataIndex: "stock",
            key: "stock",
            render: (_, record, index) => (
                <Form.Item name={`stock_${index}`}>
                    <Input
                        value={stocks[index] || ""}
                        onChange={(e) => updateStock(index, e.target.value)}
                        placeholder="Nhập số lượng kho"
                    />
                </Form.Item>
            )
        }
    ];

    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">Thông tin bán hàng</h2>
            {categories.length === 0 ? (
                <div className="mb-4 p-4 bg-gray-200 rounded-lg">
                    <Form.Item label="Giá sản phẩm" name="price_0">
                        <Input value={prices[0] || ""} onChange={(e) => updatePrice(0, e.target.value)} placeholder="Nhập giá sản phẩm" />
                    </Form.Item>
                    <Form.Item label="Số lượng kho" name="stock_0">
                        <Input value={stocks[0] || ""} onChange={(e) => updateStock(0, e.target.value)} placeholder="Nhập số lượng sản phẩm trong kho" />
                    </Form.Item>
                </div>
            ) : (
                categories.map((category, catIndex) => (
                    <div key={catIndex} className="mb-4 p-4 bg-gray-200 rounded-lg">
                        <div className="flex items-center">
                            <Form.Item label={`Phân loại ${catIndex + 1}`} className="mb-0" name={`categoryName_${catIndex}`}>
                                <Input
                                    value={category.name}
                                    onChange={(e) => updateCategoryName(catIndex, e.target.value)}
                                    placeholder="Nhập tên phân loại (VD: Màu sắc, Kích thước)"
                                />
                            </Form.Item>
                            <DeleteOutlined
                                className="text-red-400 hover:bg-red-200 rounded-full p-1 text-sm transition-colors duration-200 ease-in-out"
                                onClick={() => removeCategory(catIndex)}
                            />
                        </div>
                        <Space wrap>
                            {category.values.map((value, valIndex) => (
                                <div key={valIndex} className="flex items-center mt-2">
                                    <Form.Item className="mb-0" name={`categoryValue_${catIndex}_${valIndex}`}>
                                        <Input
                                            value={value}
                                            onChange={(e) => updateCategoryValue(catIndex, valIndex, e.target.value)}
                                            placeholder="Nhập giá trị"
                                        />
                                    </Form.Item>
                                    <DeleteOutlined
                                        className="text-red-400 hover:bg-red-200 rounded-full p-1 text-sm transition-colors duration-200 ease-in-out"
                                        onClick={() => removeCategoryValue(catIndex, valIndex)}
                                    />
                                </div>
                            ))}
                        </Space>
                        <div>
                            <Button className="mt-2" type="dashed" onClick={() => addCategoryValue(catIndex)}>
                                <PlusOutlined /> Thêm giá trị
                            </Button>
                        </div>
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