import { Form, Input, Select, Upload, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Option } = Select;

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const BasicInfo = ({ form, editingTool }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [productImages, setProductImages] = useState([]);
    const [coverImage, setCoverImage] = useState([]);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleProductImageChange = ({ fileList }) => setProductImages(fileList);
    const handleCoverImageChange = ({ fileList }) => setCoverImage(fileList.slice(-1)); // Chỉ giữ lại 1 ảnh bìa

    return (
        <div>
            <h2 className="text-xl font-semibold mb-3">Thông tin cơ bản</h2>
            <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}>
                <Input />
            </Form.Item>

            <Form.Item label="Loại sản phẩm" name="toolTypeId" rules={[{ required: true, message: "Vui lòng chọn loại sản phẩm" }]}>
                <Select placeholder="Chọn loại sản phẩm">
                    <Option value="tap-vo">Tập vở</Option>
                    <Option value="muc">Mực</Option>
                    <Option value="but">Bút</Option>
                    <Option value="giay">Giấy</Option>
                    <Option value="khac">Khác</Option>
                </Select>
            </Form.Item>

            <Form.Item label="Mô tả" name="description">
                <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item label={`Hình ảnh sản phẩm (${productImages.length}/9)`}>
                <Upload
                    listType="picture-card"
                    fileList={productImages}
                    onPreview={handlePreview}
                    onChange={handleProductImageChange}
                    beforeUpload={() => false}
                >
                    {productImages.length < 9 ? <PlusOutlined /> : null}
                </Upload>
            </Form.Item>

            <Form.Item label={`Ảnh bìa (${coverImage.length}/1)`}>
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

            {previewImage && (
                <Image
                    wrapperStyle={{ display: "none" }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                />
            )}
        </div>
    );
};

export default BasicInfo;
