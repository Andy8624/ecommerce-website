import { Form, Input, Select, Upload, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useGetAllToolType } from "../hooks/useGetAllToolType";

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const BasicInfo = ({ setProductImages, setCoverImage, coverImage, productImages, validCoverImage, validProductImage }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleProductImageChange = ({ fileList }) => setProductImages(fileList);
    const handleCoverImageChange = ({ fileList }) => setCoverImage(fileList.slice(-1)); // Chỉ giữ lại 1 ảnh bìa

    const { toolTypes, isLoadingToolTypes } = useGetAllToolType()
    return (
        <div>
            <h2 className="text-xl font-semibold mb-3">Thông tin cơ bản</h2>
            <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}>
                <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>

            <Form.Item
                label="Loại sản phẩm" name="toolTypeId"
                rules={[{ required: true, message: "Vui lòng chọn loại sản phẩm" }]}
            >
                <Select
                    placeholder="Chọn loại sản phẩm"
                    options={toolTypes?.map(item => ({
                        label: item.name,
                        value: item.toolTypeId
                    }))}
                    loading={isLoadingToolTypes}
                />
            </Form.Item>

            <Form.Item label="Mô tả" name="description">
                <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
            </Form.Item>

            <Form.Item
                label={`Hình ảnh sản phẩm (${productImages.length}/9)`}
                required
            >
                <Upload
                    listType="picture-card"
                    fileList={productImages}
                    onPreview={handlePreview}
                    onChange={handleProductImageChange}
                    beforeUpload={() => false}
                    multiple={true}
                >
                    {productImages.length < 9 ? <PlusOutlined /> : null}
                </Upload>
            </Form.Item>
            <div className="text-error">{validProductImage || "Bạn cần thêm ít nhất một ảnh sản phẩm"}</div>

            <Form.Item
                label={`Ảnh bìa (${coverImage.length}/1)`} required
            >
                <Upload
                    listType="picture-card"
                    fileList={coverImage}
                    onPreview={handlePreview}
                    onChange={handleCoverImageChange}
                    beforeUpload={() => false}
                >
                    {coverImage.length < 1 ? <PlusOutlined /> : null}
                </Upload>
            </Form.Item>
            <div className="text-error">{validCoverImage || "Bạn cần thêm ít nhất một ảnh bìa sản phẩm"}</div>

            {
                previewImage && (
                    <Image
                        wrapperStyle={{ display: "none" }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(""),
                        }}
                        src={previewImage}
                    />
                )
            }
        </div >
    );
};

export default BasicInfo;
