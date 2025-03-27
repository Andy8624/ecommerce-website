import { Col, Image, Row, Modal } from "antd";
import { useState } from "react";
import { TOOL_URL } from "../../../utils/Config";

const ProductGallery = ({ tool }) => {
    const [selectedImage, setSelectedImage] = useState(tool?.imageUrl);
    const [hoveredImage, setHoveredImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const images = tool?.imageTools || [];
    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <Col xs={24} md={12}>
            <div className="image-preview-container">
                {/* Ảnh lớn */}
                <div
                    className="large-image-wrapper mb-4"
                    onClick={() => openModal(selectedImage)}
                    style={{
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Image
                        src={hoveredImage == null ? TOOL_URL + tool?.imageUrl : TOOL_URL + hoveredImage}
                        className="rounded-lg shadow"
                        style={{
                            width: "450px",
                            height: "320px",
                            objectFit: "cover",
                            backgroundColor: "#f5f5f5",
                        }}
                        preview={false}
                    />
                </div>

                {/* Danh sách ảnh nhỏ */}
                <Row gutter={[8, 8]} justify="center">
                    {images.slice(0, 5).map((imgUrl, index) => (
                        <Col key={index} span={4}>
                            <Image
                                src={TOOL_URL + imgUrl?.fileName}
                                alt={`Thumbnail ${index}`}
                                preview={false}
                                className={`rounded-lg shadow cursor-pointer ${selectedImage === imgUrl?.fileName
                                    ? "border-2 border-[var(--primary-color)]"
                                    : "border border-gray-300"
                                    }`}
                                onMouseEnter={() => setHoveredImage(imgUrl?.fileName)} // Đặt ảnh hover
                                onMouseLeave={() => setHoveredImage(null)} // Xóa ảnh hover
                                onClick={() => openModal(imgUrl?.fileName)} // Mở modal khi click ảnh nhỏ
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    objectFit: "cover",
                                    cursor: "pointer"
                                }}
                            />
                        </Col>
                    ))}
                </Row>
            </div>

            {/* Modal hiển thị ảnh lớn và danh sách ảnh nhỏ */}
            <Modal
                open={isModalOpen}
                onCancel={closeModal}
                footer={null}
                width={1000}
            >
                {/* Bố cục ảnh */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "16px",
                    }}
                >
                    {/* Bên trái: Ảnh lớn */}
                    <div
                        style={{
                            flex: 2,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center", // Căn giữa ảnh lớn theo chiều dọc
                            backgroundColor: "#f5f5f5",
                            borderRadius: "8px",
                            height: "400px", // Đảm bảo chiều cao ảnh lớn
                            overflow: "hidden", // Ẩn phần ảnh vượt quá container
                        }}
                    >
                        <Image
                            src={TOOL_URL + selectedImage}
                            alt="Selected"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover", // Đảm bảo ảnh lấp đầy container
                            }}
                            preview={false}
                        />
                    </div>

                    {/* Bên phải: Danh sách ảnh nhỏ */}
                    <div
                        style={{
                            flex: 1,
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)", // 3 ảnh mỗi hàng
                            gap: "16px",
                            overflowY: "auto", // Cuộn nếu danh sách quá dài
                            maxHeight: "400px", // Cố định chiều cao danh sách ảnh nhỏ
                            borderRadius: "8px",
                            padding: "8px",
                            backgroundColor: "#f9f9f9",
                        }}
                    >
                        {images.map((imgUrl, index) => (
                            <div
                                key={index}
                                style={{
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                                onClick={() => setSelectedImage(imgUrl?.fileName)}
                            >
                                <Image
                                    src={TOOL_URL + imgUrl?.fileName}
                                    alt={`Thumbnail ${index}`}
                                    preview={false}
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        objectFit: "cover",
                                        borderRadius: "4px",
                                        border: selectedImage === imgUrl?.fileName ? "2px solid var(--primary-color)" : "1px solid #d9d9d9",
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>



        </Col>
    );
};

export default ProductGallery;
