import { Typography } from "antd";

const { Text, Title } = Typography;

const DescriptionProduct = ({ description }) => {
    return (
        <div
            style={{
                padding: "16px",
                backgroundColor: "#fff",
                borderRadius: "4px",
                marginTop: "16px",
            }}
        >
            {/* Tiêu đề */}
            <Title
                level={4}
                style={{
                    marginBottom: "16px",
                    fontSize: "16px", // Cỡ chữ nhỏ hơn
                    fontWeight: "bold",
                    color: "#333",
                    border: "1px solid #eaeaea", // Viền nhẹ
                    padding: "8px",
                    backgroundColor: "#f9f9f9", // Nền xám nhạt
                }}
            >
                MÔ TẢ SẢN PHẨM
            </Title>

            {/* Mô tả sản phẩm */}
            <div style={{ fontSize: "14px", lineHeight: "1.8", color: "#555" }}>
                <Text>
                    <b> Chào mừng đến với cửa hàng của tôi!!!!!!</b>
                </Text>
                <ul style={{ paddingLeft: "20px", marginTop: "12px", color: "#555" }}>
                    <li>Chúng tôi là một nhà máy văn phòng phẩm chuyên nghiệp.</li>
                    <li>Hàng hóa sẽ được vận chuyển sau khi kiểm tra.</li>
                    <li>Bao bì tinh tế, chất lượng cao và giá thấp.</li>
                    <li>Giao hàng trong vòng 24 giờ.</li>
                    <li>Sẽ có sản phẩm mới trong cửa hàng mỗi ngày.</li>
                    <li>Dịch vụ khách hàng trực tuyến 24 giờ mỗi ngày.</li>
                    <li>Nếu sản phẩm bị hư hỏng, bạn có thể liên hệ ngay để được đổi trả.</li>
                    <li>Mua sắm vui vẻ, thân yêu của tôi!!!</li>
                </ul>
                <Text>
                    <b>Mô tả sản phẩm:</b>
                </Text>
                <ul style={{ paddingLeft: "20px", marginTop: "12px", color: "#555" }}>
                    <li>Tên: Bút</li>
                    <li>Chất liệu: Khác</li>
                    <li>Phong cách: Nhật Bản và Hàn Quốc</li>
                    <li>Kích thước: Như được hiển thị</li>
                    <li>Hình dạng: Như hình</li>
                    <li>Thời gian: 2022</li>
                    <li>{description}</li>
                </ul>
            </div>
        </div>
    );
};

export default DescriptionProduct;
