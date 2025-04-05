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
            <h4 className="text-2xl text-gray-800 mb-5">
                Mô tả sản phẩm
            </h4>

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
