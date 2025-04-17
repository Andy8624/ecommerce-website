import { Steps, Form, Button, Divider } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate để thực hiện chuyển hướng
import { toast } from "react-toastify";

const { Step } = Steps;

import BasicInfo from "./BasicInfo"
import DetailedInfo from "./DetailedInfo"
import SalesInfo from "./SalesInfo"
import DeliveryInfo from "./DeliveryInfo";
import { useCreateTool } from "../hooks/useCreateTool";
import { deleteFile, uploadFile, uploadMultipleFiles } from "../../../services/FileService";
import { useSelector } from "react-redux";
import { callHardDeleteProduct } from "../../../services/ToolService";


const ProductForm = () => {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [productImages, setProductImages] = useState([]);
    const [coverImage, setCoverImage] = useState([]);

    const [categories, setCategories] = useState([]);
    const [validProductImage, setValidProductImage] = useState(true)
    const [validCoverImage, setValidCoverImage] = useState(true)
    const [canNext, setCanNext] = useState(false)
    const [attributes, setAttributes] = useState([]);

    const userId = useSelector(state => state?.account?.user?.id);

    const [prices, setPrices] = useState([]);
    const [stocks, setStocks] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); // Khai báo hook để sử dụng chuyển hướng

    const { createNewTool } = useCreateTool();

    const handleNext = async () => {
        try {
            // Validate and save data of current step
            const values = await form.validateFields();
            setFormData((prev) => ({ ...prev, ...values }));

            productImages.length < 1
                ? (setValidProductImage(false), setCanNext(false))
                : (setValidProductImage(true), setCanNext(true))

            coverImage.length < 1
                ? (setValidCoverImage(false), setCanNext(false))
                : (setValidCoverImage(true), setCanNext(true))

            if (canNext) {
                // Move to next step
                setCurrentStep(currentStep + 1);
            }

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
        setIsLoading(true); // Bắt đầu loading
        const finalData = { ...formData, ...values };
        // console.log("Submitted Data without images:", finalData);

        // Tạo object lồng cho các thuộc tính động (từ DetailedInfo)
        const dynamicAttributes = {};
        attributes.forEach(attr => {
            dynamicAttributes[attr.name] = finalData[attr.name];
            delete finalData[attr.name];
        });

        // Tạo object lồng cho thông tin bán hàng (từ SalesInfo)
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
                    price: prices[index] || 0,
                    stock: stocks[index] || 0,
                };
            }),
        };

        // Tạo object lồng cuối cùng
        const dataToSend = {
            product: {
                name: finalData.name,
                toolTypeId: finalData.toolTypeId,
                description: finalData.description,
                brand: finalData.brand,
                warranty: finalData.warranty,
                origin: finalData.origin,
                length: finalData.length,
                width: finalData.width,
                height: finalData.height,
                weight: finalData.weight,
                price_0: finalData.price_0,
                stock_0: finalData.stock_0,
                attributes: dynamicAttributes,
                salesInfo: salesInfo,
            },
            images: productImages.map((file) => file.originFileObj),
            coverImage: coverImage.length > 0 ? coverImage[0].originFileObj : null,
        };

        console.log("Data to send:", dataToSend);

        // Tạo FormData để gửi lên server
        const formDataToSend = new FormData();

        // Gửi tất cả các thuộc tính của form (trừ ảnh và salesInfo)
        Object.keys(dataToSend.product).forEach((key) => {
            if (key !== 'attributes' && key !== 'salesInfo') {
                formDataToSend.append(key, dataToSend.product[key]);
            }
        });

        // Gửi các thuộc tính động
        Object.keys(dataToSend.product.attributes).forEach((key) => {
            formDataToSend.append(`attributes[${key}]`, dataToSend.product.attributes[key]);
        });

        // Gửi thông tin bán hàng
        formDataToSend.append('salesInfo', JSON.stringify(dataToSend.product.salesInfo));

        // Gửi tất cả ảnh sản phẩm
        productImages.forEach((file) => {
            formDataToSend.append('images', file.originFileObj);
        });

        // Gửi ảnh bìa (cover image)
        if (coverImage.length > 0) {
            formDataToSend.append('coverImage', coverImage[0].originFileObj);
        }

        // Gửi dữ liệu FormData lên server
        try {
            // Upload ảnh bìa trước để lấy tên ảnh lưu vào table Product
            const uploadedFileName = await uploadFile(dataToSend.coverImage, "tools");
            // hoàn thành được up load ảnh bìa giờ tới upload thông tin sản phẩm lên
            // Tạo record table Product
            const productData = {
                user: {
                    userId: userId,
                },
                toolType: {
                    toolTypeId: dataToSend.product.toolTypeId,
                },
                name: dataToSend.product.name,
                description: dataToSend.product.description,
                brand: dataToSend.product.brand,
                origin: dataToSend.product.origin,
                imageUrl: uploadedFileName,
                discountedPrice: 10000,
                warranty: dataToSend.product.warranty,
                length: dataToSend.product.length,
                width: dataToSend.product.width,
                height: dataToSend.product.height,
                weight: dataToSend.product.weight,
                price: dataToSend.product.price_0,
                stockQuantity: dataToSend.product.stock_0,
                attributes: dataToSend.product.attributes,
                categoryDetails: {
                    category: dataToSend.product.salesInfo.categories,
                    categoryDetail: dataToSend.product.salesInfo.variants,
                },
            }
            // console.log(productData)

            const res = await createNewTool(productData);
            if (res == null) {
                toast.error("Có lỗi xảy ra khi tạo sản phẩm");
                // xóa ảnh bìa (trong thư mục) khi tạo sp k thành công
                deleteFile(uploadedFileName, "tools");
                return; // Dừng xử lý ở đây nếu có lỗi
            } else {
                const toolId = res?.toolId;
                // Từ Id của record Product vừa tạo -> tạo các ảnh sản phẩm vào table ImageTool
                const response = await uploadMultipleFiles(dataToSend.images, "tools", toolId, true);
                // console.log("response", response)
                if (response == null) {
                    toast.error("Có lỗi xảy ra khi tạo ảnh sản phẩm");
                    // xóa cứng sp (trong db) khi tạo ảnh k thành công
                    callHardDeleteProduct(toolId);
                    return; // Dừng xử lý ở đây nếu có lỗi
                } else {
                    toast.success("Tạo ảnh sản phẩm thành công");
                }
            }
            localStorage.removeItem("attributes");
            // Reset form nếu cần
            form.resetFields();
            setProductImages([]);
            setCoverImage([]);
            setCategories([]);
            setAttributes([]);
            setPrices([]);
            setStocks([]);
            // Chuyển hướng về trang trước đó hoặc trang danh sách sản phẩm
            navigate(-1);
        } catch (error) {
            console.error('Có lỗi xảy ra khi lưu dữ liệu:', error);
            toast.error("Có lỗi xảy ra: " + (error.message || "Không thể thêm sản phẩm"));
        } finally {
            setIsLoading(false); // Kết thúc loading trong mọi trường hợp
        }
    };



    return (
        <div className="p-4 bg-white shadow-md rounded">
            {/* <Title level={2}>Thêm sản phẩm</Title> */}
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
                            disabled={isLoading} // Vô hiệu hóa khi đang loading
                        >
                            Quay lại
                        </Button>
                    )}
                    {currentStep < 3 && (
                        <Button
                            type="primary"
                            onClick={handleNext}
                            disabled={isLoading} // Vô hiệu hóa khi đang loading
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
                            Hoàn tất
                        </Button>
                    )}
                    {currentStep === 3 && (
                        <Button
                            onClick={() => navigate(-1)}
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

export default ProductForm;
