import { useEffect, useState } from "react";
import { Spin, Pagination, Empty, Alert } from "antd";
import { useTools } from "../hooks/useTools";
import ToolItem from "./ToolItem";
import { getToolsByToolIds } from "../../../services/ToolService";
import { useSelector } from "react-redux";
import SectionTitle from "../../../components/SectionTitle";

const ToolListSearch = ({ pageSize }) => {
    const { isLoading, error, tools } = useTools();
    const [currentPage, setCurrentPage] = useState(1);
    const [productsSearch, setProductsSearch] = useState([]);
    const imageSearch = useSelector((state) => state?.search?.imageSearchResults) || [];
    const isLoadingSearchImage = useSelector((state) => state?.search?.searchLoading) || false;

    const searchData = [];
    if (imageSearch) {
        imageSearch.forEach((result) => {
            searchData.push(result?.toolId);
        });
    }
    // console.log("toolData", imageSearch);

    useEffect(() => {
        const fetchProducts = async () => {
            const avgMap = imageSearch?.reduce((acc, item) => {
                acc[item.toolId] = item.avgDistance;
                return acc
            }, {})
            try {
                if (searchData) {
                    let result = await getToolsByToolIds(searchData);
                    if (result?.length === 0) {
                        setProductsSearch(tools);
                        return;
                    }
                    const mergeData = result.map(item => ({
                        ...item,
                        avgDistance: avgMap[item.toolId]
                    }))
                    const sortedMergeData = mergeData.sort((a, b) => a.avgDistance - b.avgDistance);
                    setProductsSearch(sortedMergeData);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchProducts();
    }, [imageSearch]);

    if (isLoading || isLoadingSearchImage) {
        return (
            <Spin tip="Đang tìm kiếm sản phẩm bằng hình ảnh..." size="large" >
                <div className="text-center py-6" />
            </Spin>

        );
    }

    if (error) {
        return <Alert
            message="Lỗi tải dữ liệu"
            description={error.message}
            type="error" showIcon
        />;
    }

    const products = productsSearch || tools || [];

    if (products.length === 0) {
        return <Empty description="Không có sản phẩm nào" />;
    }

    return (
        <div>
            <SectionTitle>Kết quả tìm kiếm bằng hình ảnh</SectionTitle>


            {/* Danh sách sản phẩm */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {products.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((tool) => (
                    <ToolItem key={tool.toolId} tool={tool} />
                ))}
            </div>

            {/* Phân trang */}
            <div className="mt-6 flex justify-center">
                <Pagination
                    current={currentPage}
                    total={products.length}
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                />
            </div>
        </div>
    );
};

export default ToolListSearch;