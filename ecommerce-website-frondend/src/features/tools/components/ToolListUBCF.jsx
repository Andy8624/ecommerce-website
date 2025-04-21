import { useState } from 'react';
import { useUserRecommendations } from '../../../hooks/useUserRecommendations';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { ReloadOutlined } from '@ant-design/icons';
import { getToolsByToolIds } from '../../../services/ToolService';
import ToolItem from './ToolItem';
import { Spin, Pagination, Empty, Alert } from "antd";

const ToolListUBCF = ({ pageSize = 10 }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const user = useSelector(state => state.account?.user);

    // Get recommendations using custom hook
    const {
        recommendations,
        isLoading: isLoadingRecommendations,
        error: recommendationsError,
        refreshRecommendations
    } = useUserRecommendations(pageSize);

    // Extract tool IDs from recommendations
    const toolIds = recommendations.map(rec => rec.toolId);

    // Fetch tool details for each recommended tool
    const {
        data: tools,
        isLoading: isLoadingTools,
        error: toolsError
    } = useQuery({
        queryKey: ['tools', 'recommendations', toolIds],
        queryFn: () => getToolsByToolIds(toolIds),
        enabled: toolIds.length > 0,
    });

    const isLoading = isLoadingRecommendations || isLoadingTools;
    const error = recommendationsError || toolsError;

    // Show login prompt if user is not logged in
    if (!user) {
        return (
            <div className="text-center py-10">
                <Alert
                    message="Cần đăng nhập"
                    description="Vui lòng đăng nhập để nhận gợi ý sản phẩm phù hợp."
                    type="info"
                    showIcon
                />
            </div>
        );
    }

    // Show loading state
    if (isLoading) {
        return (
            <div className="text-center py-6">
                <Spin tip="Đang tải sản phẩm phù hợp với bạn..." size="large">
                    <div style={{ height: "200px" }} />
                </Spin>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="text-center py-10">
                <Alert
                    message="Lỗi tải dữ liệu"
                    description={error.message || 'Có lỗi xảy ra khi tải gợi ý sản phẩm.'}
                    type="error"
                    showIcon
                    action={
                        <button
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                            onClick={refreshRecommendations}
                        >
                            <ReloadOutlined className="mr-2" /> Thử lại
                        </button>
                    }
                />
            </div>
        );
    }

    // Show empty state
    if (!tools || tools.length === 0) {
        return <Empty description="Không có gợi ý sản phẩm nào" />;
    }

    return (
        <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {tools.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((tool) => (
                    <ToolItem key={tool.id || tool.toolId} tool={tool} />
                ))}
            </div>

            {/* Phân trang */}
            {tools.length > pageSize && (
                <div className="mt-6 flex justify-center">
                    <Pagination
                        current={currentPage}
                        total={tools.length}
                        pageSize={pageSize}
                        onChange={setCurrentPage}
                        showSizeChanger={false}
                    />
                </div>
            )}
        </div>
    );
};

export default ToolListUBCF;