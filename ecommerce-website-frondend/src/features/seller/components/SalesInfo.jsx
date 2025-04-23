import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Form, Input, Button, Table, InputNumber, Card, Tag, message } from "antd";
import { useEffect, useState } from "react";

const SalesInfo = ({
    categories, setCategories,
    prices, setPrices,
    stocks, setStocks,
    dataSource,
}) => {
    const [tableKey, setTableKey] = useState(0);
    const [categoryName, setCategoryName] = useState("");
    const [categoryValues, setCategoryValues] = useState("");


    console.log("categories", categories);
    // Sử dụng useEffect để kiểm tra và thiết lập giá trị ban đầu
    useEffect(() => {
        // Chỉ thiết lập ban đầu nếu có dataSource nhưng prices/stocks chưa được thiết lập
        if (dataSource && dataSource.length > 0) {
            if (prices.length === 0 || prices.every(price => price === undefined || price === "")) {
                // Tạo mảng giá ban đầu với giá trị 0
                const initialPrices = Array(dataSource.length).fill("0");
                setPrices(initialPrices);
            }

            if (stocks.length === 0 || stocks.every(stock => stock === undefined || stock === "")) {
                // Tạo mảng tồn kho ban đầu với giá trị 0
                const initialStocks = Array(dataSource.length).fill("0");
                setStocks(initialStocks);
            }
        }

        // Force re-render bảng khi prices hoặc stocks thay đổi
        setTableKey(prev => prev + 1);
    }, [dataSource, prices.length, stocks.length, setPrices, setStocks]);

    // Force re-render khi prices hoặc stocks thay đổi giá trị
    useEffect(() => {
        setTableKey(prev => prev + 1);
    }, [prices, stocks]);

    // Xử lý thêm danh mục mới
    const handleAddCategory = () => {
        if (categories.length >= 2) {
            message.warning("Chỉ được phép tạo tối đa 2 biến thể!");
            return;
        }

        if (!categoryName || !categoryValues) {
            message.warning("Vui lòng nhập đầy đủ tên danh mục và giá trị!");
            return;
        }

        const valueArray = categoryValues.split(",")
            .map(value => value.trim())
            .filter(value => value);

        if (valueArray.length === 0) {
            message.warning("Vui lòng nhập ít nhất một giá trị cho danh mục!");
            return;
        }

        const newCategory = {
            name: categoryName,
            values: valueArray
        };

        setCategories([...categories, newCategory]);
        setCategoryName("");
        setCategoryValues("");
    };

    // Xử lý xóa danh mục
    const handleRemoveCategory = (categoryIndex) => {
        const updatedCategories = categories.filter((_, index) => index !== categoryIndex);
        setCategories(updatedCategories);
    };

    // Xử lý thay đổi giá
    const handlePriceChange = (index, value) => {
        const newPrices = [...prices];
        newPrices[index] = value !== null && value !== undefined ? value.toString() : "0";
        setPrices(newPrices);
    };

    // Xử lý thay đổi số lượng trong kho
    const handleStockChange = (index, value) => {
        const newStocks = [...stocks];
        newStocks[index] = value !== null && value !== undefined ? value.toString() : "0";
        setStocks(newStocks);
    };

    // Tạo cột cho bảng biến thể
    const generateColumns = () => {
        const columns = categories.map((category, index) => ({
            title: category.name,
            dataIndex: `category${index}`,
            key: `category${index}`,
            render: (text) => <Tag color="blue">{text}</Tag>,
            width: 120,
        }));

        return [
            ...columns,
            {
                title: "Giá (VNĐ)",
                key: "price",
                render: (_, record, index) => (
                    <InputNumber
                        min={0}
                        style={{ width: 120 }}
                        value={prices[index] !== undefined ? Number(prices[index]) : 0}
                        onChange={(value) => handlePriceChange(index, value)}
                    // formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    // parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                ),
                width: 120,
            },
            {
                title: "Tồn kho",
                key: "stock",
                render: (_, record, index) => (
                    <InputNumber
                        min={0}
                        style={{ width: 80 }}
                        value={stocks[index] !== undefined ? Number(stocks[index]) : 0}
                        onChange={(value) => handleStockChange(index, value)}
                    />
                ),
                width: 80,
            }
        ];
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-3">Thông tin bán hàng</h2>
            <Card title="Thông tin cơ bản" className="mb-4">
                <Form.Item label="Giá cơ bản" name="price_0" rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm' }]}>
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        // formatter={(value) => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        // parser={(value) => value.replace(/₫\s?|(,*)/g, '')}
                        placeholder="Nhập giá gốc của sản phẩm"
                    />
                </Form.Item>
                <Form.Item label="Kho hàng" name="stock_0" rules={[{ required: true, message: 'Vui lòng nhập số lượng hàng' }]}>
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        placeholder="Nhập số lượng sản phẩm trong kho"
                    />
                </Form.Item>
            </Card>

            <Card title="Biến thể sản phẩm" className="mb-4">
                <p className="mb-2 text-gray-500 text-sm">Thêm các biến thể như màu sắc, kích thước, hương vị... (tối đa 2 biến thể)</p>

                {/* Hiển thị danh sách các danh mục hiện tại */}
                {categories.map((category, index) => (
                    <div key={index} className="flex flex-wrap items-center mb-2 bg-gray-50 p-2 rounded">
                        <div className="mr-2 font-medium">{category.name}:</div>
                        <div className="flex-1 flex flex-wrap gap-1">
                            {category.values.map((value, vIndex) => (
                                <Tag key={vIndex} color="blue">{value}</Tag>
                            ))}
                        </div>
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemoveCategory(index)}
                        />
                    </div>
                ))}

                {/* Form thêm danh mục mới */}
                {categories.length < 2 && (
                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        <Input
                            placeholder="Tên danh mục (vd: Màu sắc, Kích thước)"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="flex-1"
                        />
                        <Input
                            placeholder="Giá trị (phân tách bằng dấu phẩy)"
                            value={categoryValues}
                            onChange={(e) => setCategoryValues(e.target.value)}
                            className="flex-1"
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAddCategory}
                        >
                            Thêm
                        </Button>
                    </div>
                )}

                {/* {categories.length >= 2 && (
                    <p className="mt-2 text-amber-500">
                        Đã đạt số lượng biến thể tối đa (2/2)
                    </p>
                )} */}
            </Card>

            {/* Hiển thị bảng biến thể nếu có ít nhất một danh mục */}
            {categories.length > 0 && dataSource && dataSource.length > 0 && (
                <Card title="Bảng biến thể" className="mb-4">
                    <p className="mb-3 text-gray-500">
                        <strong>Lưu ý:</strong> Giá sản phẩm sẽ hiển thị là giá nhỏ nhất trong các biến thể.
                        Tồn kho sẽ là tổng của tất cả các biến thể.
                    </p>
                    <Table
                        key={tableKey}
                        columns={generateColumns()}
                        dataSource={dataSource}
                        pagination={false}
                        rowKey="key"
                        scroll={{ x: 'max-content' }}
                        bordered
                        size="small"
                    />
                </Card>
            )}
        </div>
    );
};

export default SalesInfo;