import { Col, Image, Row, Modal } from "antd";
import { useState } from "react";

const ProductGallery = ({ images, productName, tool }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]); // Ảnh được chọn
    const [hoveredImage, setHoveredImage] = useState(null); // Ảnh tạm thời khi hover
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl); // Đặt ảnh được chọn
        setIsModalOpen(true); // Mở modal
    };

    const closeModal = () => {
        setIsModalOpen(false); // Đóng modal
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
                        src={hoveredImage || selectedImage} // Hiển thị ảnh đang hover hoặc ảnh được chọn
                        alt={productName}
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
                                src={imgUrl}
                                alt={`Thumbnail ${index}`}
                                preview={false}
                                className={`rounded-lg shadow cursor-pointer ${selectedImage === imgUrl
                                    ? "border-2 border-blue-500"
                                    : "border border-gray-300"
                                    }`}
                                onMouseEnter={() => setHoveredImage(imgUrl)} // Đặt ảnh hover
                                onMouseLeave={() => setHoveredImage(null)} // Xóa ảnh hover
                                onClick={() => openModal(imgUrl)} // Mở modal khi click ảnh nhỏ
                                style={{
                                    width: "100%",
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
                            src={selectedImage}
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
                                    height: "100px",
                                }}
                                onClick={() => setSelectedImage(imgUrl)}
                            >
                                <Image
                                    src={imgUrl}
                                    alt={`Thumbnail ${index}`}
                                    preview={false}
                                    style={{
                                        width: "100%",
                                        height: "100px",
                                        objectFit: "cover",
                                        borderRadius: "4px",
                                        border: selectedImage === imgUrl ? "2px solid #8294C4" : "1px solid #d9d9d9",
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
