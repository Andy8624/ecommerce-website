import { useState, useEffect } from 'react';
import { useUserRecommendations } from '../../../hooks/useUserRecommendations';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { ReloadOutlined } from '@ant-design/icons';
import { getToolsByToolIds } from '../../../services/ToolService';
import ToolItem from './ToolItem';
import { Spin, Pagination, Empty, Alert, Button } from "antd";

const ToolListUBCF = ({ pageSize = 10 }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortedTools, setSortedTools] = useState([]);
    const [retryCount, setRetryCount] = useState(0);
    const user = useSelector(state => state.account?.user);

    // Get recommendations using custom hook
    const {
        recommendations,
        isLoading: isLoadingRecommendations,
        isFetching: isFetchingRecommendations,
        error: recommendationsError,
        refreshRecommendations
    } = useUserRecommendations(pageSize);

    // Extract tool IDs from recommendations
    const toolIds = recommendations?.map(rec => rec.toolId) || [];

    // Fetch tool details for each recommended tool
    const {
        data: tools,
        isLoading: isLoadingTools,
        error: toolsError,
        isFetching: isFetchingTools
    } = useQuery({
        queryKey: ['tools', 'recommendations', toolIds, retryCount],
        queryFn: () => getToolsByToolIds(toolIds),
        enabled: toolIds.length > 0,
        retry: 1,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    // Sắp xếp sản phẩm theo điểm (score) giảm dần
    useEffect(() => {
        // Chỉ chạy khi tools và recommendations thực sự thay đổi và có giá trị
        if (!tools || !recommendations) return;

        if (tools.length > 0 && recommendations.length > 0) {
            // Tạo bản đồ điểm từ recommendations để tra cứu nhanh
            const scoreMap = new Map();
            recommendations.forEach(rec => {
                scoreMap.set(rec.toolId.toString(), rec.score);
            });

            // Tạo bản sao của tools và gán điểm
            const toolsWithScores = tools.map(tool => ({
                ...tool,
                score: scoreMap.get(tool.toolId?.toString()) || 0
            }));

            // Sắp xếp theo điểm giảm dần
            const sorted = toolsWithScores.sort((a, b) => b.score - a.score);

            // So sánh kết quả mới với state hiện tại để tránh cập nhật không cần thiết
            if (JSON.stringify(sorted) !== JSON.stringify(sortedTools)) {
                setSortedTools(sorted);
            }
        } else {
            if (sortedTools.length > 0) {
                setSortedTools([]);
            }
        }
    }, [tools, recommendations]);

    // Handle manual refresh
    const handleRefresh = () => {
        setRetryCount(prev => prev + 1);
        refreshRecommendations();
    };

    const isLoading = isLoadingRecommendations || isLoadingTools;
    const isFetching = isFetchingRecommendations || isFetchingTools;
    const error = recommendationsError || toolsError;

    // Show login prompt if user is not logged in
    if (!user?.id) {
        return (
            <div className="text-center py-5 mb-2 bg-white rounded-lg shadow-sm">
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
    if (isLoading && !error) {
        return (
            <div className="text-center py-5 mb-2 bg-white rounded-lg shadow-sm">
                <Spin tip="Đang tải sản phẩm phù hợp với bạn..." size="large">
                    <div style={{ height: "100px" }} />
                </Spin>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="text-center py-5 mb-2 bg-white rounded-lg shadow-sm">
                <Alert
                    message="Không thể tải đề xuất sản phẩm"
                    description={
                        <div>
                            <p>Có thể hệ thống gợi ý đang gặp sự cố. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.</p>
                            <div className="mt-3">
                                <Button
                                    type="primary"
                                    icon={<ReloadOutlined />}
                                    onClick={handleRefresh}
                                    loading={isFetching}
                                    disabled={isFetching}
                                >
                                    {isFetching ? 'Đang thử lại...' : 'Thử lại'}
                                </Button>
                            </div>
                        </div>
                    }
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    // Show empty state
    if (!sortedTools || sortedTools.length === 0) {
        return (
            <div className="py-5 mb-2 bg-white rounded-lg shadow-sm">
                <Empty
                    description="Chưa có gợi ý sản phẩm nào cho bạn"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {sortedTools.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((tool) => (
                    <ToolItem key={tool.id || tool.toolId} tool={tool} />
                ))}
            </div>

            {/* Phân trang */}
            {sortedTools.length > pageSize && (
                <div className="mt-6 flex justify-center">
                    <Pagination
                        current={currentPage}
                        total={sortedTools.length}
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