import { useEffect, useState } from "react";
import { Spin, Empty, Pagination, Typography, } from "antd";
import ToolItem from "../../tools/components/ToolItem";
import { useGetAllToolByUserId } from "../../seller/hooks/useGetAllToolByUserId";
import SectionTitle from "../../../components/SectionTitle";

const { Title } = Typography;

const ShopOtherProduct = ({ shopId, currentToolId, pageSize = 10 }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const { tools, isLoading, error } = useGetAllToolByUserId(shopId);
    const [otherProducts, setOtherProducts] = useState([]);

    // Lọc ra các sản phẩm khác của shop (trừ sản phẩm hiện tại)
    useEffect(() => {
        if (tools && tools.length > 0) {
            const filteredProducts = tools.filter(tool => tool.toolId !== parseInt(currentToolId));
            setOtherProducts(filteredProducts);
        }
    }, [tools, currentToolId]);

    if (isLoading) {
        return (
            <div className="text-center py-6">
                <Spin tip="Đang tải sản phẩm khác từ shop..." size="large">
                    <div style={{ height: "100px" }} />
                </Spin>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-6">
                <Title level={5} type="danger">Có lỗi xảy ra khi tải sản phẩm</Title>
            </div>
        );
    }

    if (!otherProducts || otherProducts.length === 0) {
        return (
            <div className="py-6">
                <SectionTitle>Sản phẩm khác của shop</SectionTitle>
                <Empty description="Shop này chưa có sản phẩm nào khác" />
            </div>
        );
    }

    // Tính toán sản phẩm sẽ hiển thị trên trang hiện tại
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentProducts = otherProducts.slice(startIndex, endIndex);

    return (
        <div className="py-6">
            <SectionTitle>Sản phẩm khác của shop</SectionTitle>
            <div className="mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {currentProducts.map((product) => (
                        <ToolItem key={product.toolId} tool={product} />
                    ))}
                </div>

                {otherProducts.length > pageSize && (
                    <div className="mt-6 flex justify-center">
                        <Pagination
                            current={currentPage}
                            total={otherProducts.length}
                            pageSize={pageSize}
                            onChange={(page) => setCurrentPage(page)}
                            showSizeChanger={false}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopOtherProduct;