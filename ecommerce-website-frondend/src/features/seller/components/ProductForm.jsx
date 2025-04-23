import { Steps, Form, Button, Divider } from "antd";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const { Step } = Steps;

import BasicInfo from "./BasicInfo"
import DetailedInfo from "./DetailedInfo"
import SalesInfo from "./SalesInfo"
import DeliveryInfo from "./DeliveryInfo";
import { useCreateTool } from "../hooks/useCreateTool";
import { useUpdateTool } from "../hooks/useUpdateTool";
import { deleteFile, uploadFile, uploadMultipleFiles } from "../../../services/FileService";
import { useSelector } from "react-redux";
import { callHardDeleteProduct } from "../../../services/ToolService";
import { TOOL_URL } from "../../../utils/Config";

const ProductForm = () => {
    const location = useLocation();
    const { editMode = false, toolToEdit = null } = location.state || {};
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [productImages, setProductImages] = useState([]);
    const [coverImage, setCoverImage] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    const [categories, setCategories] = useState([]);
    const [validProductImage, setValidProductImage] = useState(true)
    const [validCoverImage, setValidCoverImage] = useState(true)
    const [canNext, setCanNext] = useState(false)
    const [attributes, setAttributes] = useState([]);

    const userId = useSelector(state => state?.account?.user?.id);

    const [prices, setPrices] = useState([]);
    const [stocks, setStocks] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { createNewTool } = useCreateTool();
    const { updateTool } = useUpdateTool();

    // Thêm state mới để lưu trữ thông tin đầy đủ của biến thể
    const [variantsInfo, setVariantsInfo] = useState(new Map());

    // Cập nhật phần useEffect xử lý khi component mount trong chế độ chỉnh sửa

    useEffect(() => {
        if (editMode && toolToEdit) {
            // Đầu tiên, xóa bất kỳ thuộc tính nào có thể còn trong localStorage
            localStorage.removeItem("attributes");

            // Điền dữ liệu cơ bản vào form
            form.setFieldsValue({
                name: toolToEdit.name,
                toolTypeId: toolToEdit.toolType.toolTypeId,
                description: toolToEdit.description,
                brand: toolToEdit.brand,
                warranty: toolToEdit.warranty,
                origin: toolToEdit.origin,
                length: toolToEdit.length,
                width: toolToEdit.width,
                height: toolToEdit.height,
                weight: toolToEdit.weight,
                price_0: toolToEdit.price,
                stock_0: toolToEdit.stockQuantity
            });

            // Reset các state liên quan đến thuộc tính
            setAttributes([]);

            // Xử lý ảnh bìa
            if (toolToEdit.imageUrl) {
                const coverImageObj = {
                    uid: '-1',
                    name: toolToEdit.imageUrl,
                    status: 'done',
                    url: `${TOOL_URL}${toolToEdit.imageUrl}`,
                    isExisting: true, // Đánh dấu đây là ảnh đã tồn tại
                };
                setCoverImage([coverImageObj]);
            }

            // Xử lý ảnh sản phẩm
            if (toolToEdit.imageTools && toolToEdit.imageTools.length > 0) {
                const imgList = toolToEdit.imageTools.map((img, index) => ({
                    uid: `-${index + 2}`,
                    name: img.fileName,
                    status: 'done',
                    url: `${TOOL_URL}${img.fileName}`,
                    isExisting: true,
                    imageId: img.imageId
                }));
                setProductImages(imgList);
                setExistingImages(imgList);
            }

            // Xử lý thuộc tính
            if (toolToEdit.attributes && toolToEdit.attributes.length > 0) {
                const attrList = toolToEdit.attributes.map(attr => ({
                    name: attr.name,
                    value: attr.value,
                    id: attr.id
                }));
                setAttributes(attrList);

                // Set giá trị thuộc tính vào form
                attrList.forEach(attr => {
                    form.setFieldValue(attr.name, attr.value);
                });

                // Lưu attributes vào localStorage nếu cần
                localStorage.setItem("attributes", JSON.stringify(attrList));
            }

            // Xử lý biến thể sản phẩm
            if (toolToEdit.variants && toolToEdit.variants.length > 0) {
                try {
                    // Tạo map để nhóm các thuộc tính theo categoryName
                    const categoriesMap = new Map();

                    // Lưu thông tin đầy đủ của tất cả các biến thể
                    const variantsData = new Map();

                    // Lặp qua tất cả biến thể để xác định các danh mục và giá trị
                    toolToEdit.variants.forEach(variant => {
                        // Tạo key để định danh biến thể
                        const variantKey = variant.attributes
                            .sort((a, b) => a.categoryName.localeCompare(b.categoryName))
                            .map(attr => `${attr.categoryName}:${attr.attributeValue}`)
                            .join('|');

                        // Lưu trữ thông tin đầy đủ của biến thể
                        variantsData.set(variantKey, {
                            variantId: variant.variantId,
                            price: variant.price.toString(),
                            stockQuantity: variant.stockQuantity.toString(),
                            attributes: variant.attributes
                        });

                        // Thu thập danh mục và giá trị
                        variant.attributes.forEach(attr => {
                            const { categoryName, attributeValue } = attr;

                            if (!categoriesMap.has(categoryName)) {
                                categoriesMap.set(categoryName, new Set());
                            }

                            categoriesMap.get(categoryName).add(attributeValue);
                        });
                    });

                    // Lưu thông tin biến thể đầy đủ để sử dụng khi submit
                    setVariantsInfo(variantsData);

                    // Chuyển đổi Map thành mảng categories
                    const extractedCategories = Array.from(categoriesMap).map(([name, valuesSet]) => ({
                        name,
                        values: Array.from(valuesSet)
                    }));

                    setCategories(extractedCategories);

                    // Tạo danh sách các biến thể và ánh xạ với dữ liệu giá và tồn kho
                    // Đây là một cách xác định mỗi biến thể dựa trên tổ hợp các giá trị thuộc tính
                    const generateVariantKey = (attributes) => {
                        return attributes
                            .sort((a, b) => a.categoryName.localeCompare(b.categoryName))
                            .map(attr => `${attr.categoryName}:${attr.attributeValue}`)
                            .join('|');
                    };

                    // Tạo map variant key => index
                    const variantMap = new Map();
                    toolToEdit.variants.forEach(variant => {
                        const key = generateVariantKey(variant.attributes);
                        variantMap.set(key, {
                            price: variant.price?.toString() || "0",
                            stock: variant.stockQuantity?.toString() || "0"
                        });
                    });

                    // Tạo danh sách các biến thể với tất cả tổ hợp có thể
                    const allVariants = generateAllVariantCombinations(extractedCategories);

                    // Tạo mảng giá và tồn kho cho từng biến thể
                    const pricesList = [];
                    const stocksList = [];

                    allVariants.forEach((variantAttributes, index) => {
                        // Tạo key cho biến thể hiện tại
                        const variantKey = generateVariantKey(
                            variantAttributes.map(({ category, value }) => ({
                                categoryName: category,
                                attributeValue: value
                            }))
                        );

                        // Kiểm tra xem biến thể này có trong dữ liệu server không
                        if (variantMap.has(variantKey)) {
                            const variantData = variantMap.get(variantKey);
                            pricesList[index] = variantData.price;
                            stocksList[index] = variantData.stock;
                        } else {
                            // Nếu không có, sử dụng giá trị mặc định
                            pricesList[index] = "0";
                            stocksList[index] = "0";
                        }
                    });

                    setPrices(pricesList);
                    setStocks(stocksList);

                } catch (error) {
                    console.error("Lỗi khi xử lý biến thể sản phẩm:", error);
                }
            }

            // Validate form để có thể chuyển qua các bước tiếp theo
            setValidProductImage(true);
            setValidCoverImage(true);
            setCanNext(true);
        } else {
            // Không phải chế độ chỉnh sửa, reset form và xóa thuộc tính trong localStorage
            setAttributes([]);
            localStorage.removeItem("attributes");
        }
    }, [editMode, toolToEdit, form]);

    // const generateVariantsFromCategories = (categoryList) => {
    //     if (!categoryList || categoryList.length === 0) return [];

    //     return categoryList.reduce((acc, category) => {
    //         if (acc.length === 0) return category.values.map(value => [value]);
    //         return acc.flatMap(prev => category.values.map(value => [...prev, value]));
    //     }, []);
    // };

    // const findVariantIndex = (variantList, attributeValues) => {
    //     for (let i = 0; i < variantList.length; i++) {
    //         const variant = variantList[i];
    //         if (attributeValues.every(value => variant.includes(value))) {
    //             return i;
    //         }
    //     }
    //     return -1;
    // };

    const handleNext = async () => {
        try {
            // Validate and save data of current step
            const values = await form.validateFields();
            setFormData((prev) => ({ ...prev, ...values }));

            if (currentStep === 0) {
                // Kiểm tra các điều kiện ở bước 1
                const hasProductImages = productImages.length > 0;
                const hasCoverImage = coverImage.length > 0;

                setValidProductImage(hasProductImages);
                setValidCoverImage(hasCoverImage);

                if (!hasProductImages || !hasCoverImage) {
                    setCanNext(false);
                    return;
                }
            }

            setCanNext(true);
            setCurrentStep(currentStep + 1);
        } catch (error) {
            console.log("Validation Failed:", error);
        }
    };

    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
    };

    const generateCombinations = () => {
        if (categories.length === 0) return [];

        return categories.reduce((acc, category) => {
            if (acc.length === 0) return category.values.map(value => [value]);
            return acc.flatMap(prev => category.values.map(value => [...prev, value]));
        }, []);
    };

    const productVariants = generateCombinations();

    const dataSource = productVariants.map((variant, index) => {
        const row = { key: index };
        variant.forEach((value, i) => {
            row[`category${i}`] = value;
        });
        return row;
    });

    const handleSubmit = async (values) => {
        setIsLoading(true);
        const finalData = { ...formData, ...values };
        console.log("Final Data:", finalData);

        try {
            // Tạo object cho các thuộc tính động
            const dynamicAttributes = {};

            // Chỉ xử lý attributes nếu có thuộc tính
            if (attributes && attributes.length > 0) {
                attributes.forEach(attr => {
                    if (attr.name && attr.name.trim()) {
                        dynamicAttributes[attr.name] = finalData[attr.name];
                        delete finalData[attr.name];
                    }
                });
            }

            // Tạo object cho thông tin bán hàng
            const salesInfo = {
                categories: categories.map(category => ({
                    name: category.name,
                    values: category.values,
                })),
                variants: productVariants.map((variant, index) => {
                    const variantData = {};
                    variant.forEach((value, i) => {
                        variantData[`category${i}`] = value;
                    });

                    return {
                        ...variantData,
                        price: Number(prices[index]) || 0,
                        stock: Number(stocks[index]) || 0
                    };
                }),
            };

            console.log("Sales Info:", salesInfo);

            // Tính toán giá và tồn kho dựa trên biến thể (nếu có)
            let finalPrice = finalData.price_0;
            let finalStock = finalData.stock_0;

            if (salesInfo.variants.length > 0) {
                // Khi có biến thể: giá = min(giá các biến thể), tồn kho = tổng tồn kho các biến thể
                const allPrices = salesInfo.variants.map(v => Number(v.price)).filter(p => p > 0);
                const allStocks = salesInfo.variants.map(v => Number(v.stock));

                if (allPrices.length > 0) {
                    finalPrice = Math.min(...allPrices);
                }

                if (allStocks.length > 0) {
                    finalStock = allStocks.reduce((sum, stock) => sum + stock, 0);
                }
            }

            // Phân biệt giữa ảnh mới và ảnh cũ
            const newProductImages = productImages.filter(img => !img.isExisting).map(img => img.originFileObj);
            const newCoverImage = coverImage.length > 0 && !coverImage[0].isExisting ? coverImage[0].originFileObj : null;

            if (editMode) {
                // Xử lý cập nhật sản phẩm
                let updatedCoverImageName = toolToEdit.imageUrl;

                // Nếu có ảnh bìa mới, upload ảnh bìa
                if (newCoverImage) {
                    updatedCoverImageName = await uploadFile(newCoverImage, "tools");
                }

                // Chuẩn bị dữ liệu cập nhật
                const updatedProductData = {
                    user: {
                        userId: userId,
                    },
                    toolType: {
                        toolTypeId: finalData.toolTypeId,
                    },
                    name: finalData.name,
                    description: finalData.description,
                    brand: finalData.brand,
                    origin: finalData.origin,
                    imageUrl: updatedCoverImageName,
                    warranty: finalData.warranty,
                    length: finalData.length,
                    width: finalData.width,
                    height: finalData.height,
                    weight: finalData.weight,
                    price: finalPrice,
                    stockQuantity: finalStock,
                    ...(Object.keys(dynamicAttributes).length > 0 && { attributes: dynamicAttributes }),
                    active: true, // Trường active cần được gửi đi
                    categoryDetails: {
                        category: salesInfo.categories,
                        categoryDetail: productVariants.map((variant, index) => {
                            // Lấy các giá trị biến thể từ dữ liệu
                            const variantKey = variant
                                .map((value, i) => `${categories[i].name}:${value}`)
                                .sort()
                                .join('|');

                            // Tìm biến thể đã tồn tại để lấy categoryId và variantId
                            const existingVariant = variantsInfo.get(variantKey);

                            // Tạo dữ liệu cho biến thể theo định dạng mong muốn
                            return {
                                // Thêm categoryId0, categoryId1 nếu có
                                categoryId0: existingVariant?.attributes[0]?.categoryDetailId || null,
                                categoryId1: existingVariant?.attributes[1]?.categoryDetailId || null,

                                // Thêm các giá trị biến thể
                                category0: variant[0] || null,
                                category1: variant[1] || null,

                                // Giá và số lượng tồn kho
                                price: Number(prices[index]) || 0,
                                stock: Number(stocks[index]) || 0,
                            };
                        })
                    },
                };

                console.log("Dữ liệu cập nhật:", JSON.stringify(updatedProductData, null, 2));

                // Gọi API cập nhật sản phẩm
                const res = await updateTool({
                    toolId: toolToEdit.toolId,
                    updatedTool: updatedProductData
                });

                // Phần còn lại giữ nguyên
                if (res) {
                    // Nếu có ảnh mới, upload
                    if (newProductImages.length > 0) {
                        await uploadMultipleFiles(newProductImages, "tools", toolToEdit.toolId, true);
                    }
                }
            } else {
                // Xử lý tạo mới sản phẩm
                const uploadedFileName = await uploadFile(newCoverImage || coverImage[0].originFileObj, "tools");
                console.log("Uploaded file name:", uploadedFileName);
                const productData = {
                    user: {
                        userId: userId,
                    },
                    toolType: {
                        toolTypeId: finalData.toolTypeId,
                    },
                    name: finalData.name,
                    description: finalData.description,
                    brand: finalData.brand,
                    origin: finalData.origin,
                    imageUrl: uploadedFileName,
                    discountedPrice: 0,
                    warranty: finalData.warranty,
                    length: finalData.length,
                    width: finalData.width,
                    height: finalData.height,
                    weight: finalData.weight,
                    price: finalPrice,
                    stockQuantity: finalStock,
                    ...(Object.keys(dynamicAttributes).length > 0 && { attributes: dynamicAttributes }),
                    active: true, // Thêm trường active
                    categoryDetails: {
                        category: salesInfo.categories,
                        categoryDetail: productVariants.map((variant, index) => {
                            // Khi tạo mới, chỉ cần định dạng đơn giản
                            return {
                                categoryId0: null,
                                categoryId1: null,
                                category0: variant[0] || null,
                                category1: variant[1] || null,
                                price: Number(prices[index]) || 0,
                                stock: Number(stocks[index]) || 0
                            };
                        })
                    },
                };

                // Phần còn lại giữ nguyên
                console.log("Dữ liệu sản phẩm mới:", JSON.stringify(productData, null, 2));

                // Tiếp tục xử lý tạo mới
                const res = await createNewTool(productData);
                // ...xử lý response...
            }

            // Chuyển về trang quản lý sản phẩm
            navigate("/seller/products");
        } catch (error) {
            console.error('Có lỗi xảy ra khi lưu dữ liệu:', error);
            toast.error("Có lỗi xảy ra: " + (error.message || "Không thể xử lý yêu cầu"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 bg-white shadow-md rounded">
            <h2 className="text-xl font-semibold mb-4">{editMode ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h2>
            <Form form={form} onFinish={handleSubmit}>
                <Steps current={currentStep} onChange={setCurrentStep} className="mt-5">
                    <Step title="Thông tin cơ bản" />
                    <Step title="Thông tin chi tiết" disabled={currentStep < 1} />
                    <Step title="Thông tin bán hàng" disabled={currentStep < 2} />
                    <Step title="Thông tin giao hàng" disabled={currentStep < 3} />
                </Steps>
                <Divider />

                <div className="step-content">
                    {currentStep === 0 && <BasicInfo
                        validCoverImage={validCoverImage}
                        validProductImage={validProductImage}
                        productImages={productImages} setProductImages={setProductImages}
                        coverImage={coverImage} setCoverImage={setCoverImage}
                    />}
                    {currentStep === 1 && <DetailedInfo
                        attributes={attributes}
                        setAttributes={setAttributes}
                    />}
                    {currentStep === 2 && <SalesInfo
                        categories={categories}
                        setCategories={setCategories}
                        productVariants={productVariants}
                        dataSource={dataSource}
                        prices={prices}
                        setPrices={setPrices}
                        stocks={stocks}
                        setStocks={setStocks}
                    />}
                    {currentStep === 3 && <DeliveryInfo />}
                </div>

                <div className="step-actions mt-4">
                    {currentStep > 0 && (
                        <Button
                            onClick={handlePrevious}
                            className="mr-4"
                            disabled={isLoading}
                        >
                            Quay lại
                        </Button>
                    )}
                    {currentStep < 3 && (
                        <Button
                            type="primary"
                            onClick={handleNext}
                            disabled={isLoading}
                        >
                            Tiếp theo
                        </Button>
                    )}
                    {currentStep === 3 && (
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                        >
                            {editMode ? "Cập nhật" : "Hoàn tất"}
                        </Button>
                    )}
                    {currentStep === 3 && (
                        <Button
                            onClick={() => navigate("/seller/product-management")}
                            className="ml-2"
                            disabled={isLoading}
                        >
                            Hủy
                        </Button>
                    )}
                </div>
            </Form>
        </div>
    );
};

// Hàm tạo tất cả các tổ hợp biến thể có thể từ categories
const generateAllVariantCombinations = (categoryList) => {
    if (!categoryList || categoryList.length === 0) return [];

    // Function để tạo tất cả tổ hợp có thể từ các categories
    const generateCombinations = (categories, index = 0, current = []) => {
        if (index >= categories.length) {
            return [current];
        }

        const category = categories[index];
        const results = [];

        for (const value of category.values) {
            results.push(
                ...generateCombinations(
                    categories,
                    index + 1,
                    [...current, { category: category.name, value }]
                )
            );
        }

        return results;
    };

    return generateCombinations(categoryList);
};

export default ProductForm;
