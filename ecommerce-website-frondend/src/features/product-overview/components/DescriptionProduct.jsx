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
                    fontSize: "1.2rem",
                    fontWeight: "500",
                    color: "#333",
                    border: "1px solid #eaeaea",
                    padding: "0.9rem",
                    backgroundColor: "#f9f9f9",
                }}
            >
                Mô tả sản phẩm
            </Title>

            {/* Mô tả sản phẩm */}
            <div style={{
                fontSize: "1rem", padding: "0.9rem",
                lineHeight: "1.8", color: "#555"
            }}>
                <div>{description}</div>
            </div>
        </div>
    );
};

export default DescriptionProduct;
