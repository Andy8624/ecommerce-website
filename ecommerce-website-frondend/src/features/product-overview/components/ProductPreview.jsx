import { Rate, Avatar, Spin, Empty, Image, Button } from "antd";
import { UserOutlined, PictureOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { useState, useMemo } from "react";
import { useProductReview, useProductReviewOfUser } from "../hooks/useProductReviewOfUser";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { REVIEW_URL } from "../../../utils/Config";
const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    // Convert to appropriate time units
    if (diffInSeconds < 60) {
        return 'vừa xong';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} phút trước`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} giờ trước`;
    } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} ngày trước`;
    } else if (diffInSeconds < 31536000) {
        const months = Math.floor(diffInSeconds / 2592000);
        return `${months} tháng trước`;
    } else {
        const years = Math.floor(diffInSeconds / 31536000);
        return `${years} năm trước`;
    }
};

// Helper function to transform API review data to the format we need
const transformReview = (review) => {
    // Split image URLs string into array if it exists
    const images = review.imageUrls ?
        review.imageUrls.split(',').map(url => `${REVIEW_URL}${url}`) :
        [];

    return {
        id: review.id,
        user: {
            fullName: review.createdBy?.split('@')[0] || 'Người dùng',
            imageUrl: "",
            verified: true
        },
        rating: review.rating,
        comment: review.buyerReview,
        createdAt: review.createdAt,
        images: images,
        shopAnswer: review.shopAnswer
    };
};

const ProductPreview = () => {
    const [filterRating, setFilterRating] = useState(0);
    const [showImageOnly, setShowImageOnly] = useState(false);
    const [showUserReviews, setShowUserReviews] = useState(false); // Add this state for toggling visibility
    const userId = useSelector(state => state?.account?.user?.id);
    const { toolId } = useParams();

    const { userReviews, isLoading: userReviewLoading } = useProductReviewOfUser(userId, toolId);
    const { productReviews, isLoading: productReviewLoading } = useProductReview(toolId);
    // console.log("userReviews", userReviews);
    const isLoading = userReviewLoading || productReviewLoading;

    // Transform the reviews data
    const transformedReviews = useMemo(() => {
        if (!productReviews) return [];
        return productReviews.map(transformReview);
    }, [productReviews]);

    // Calculate average rating
    const averageRating = useMemo(() => {
        if (!transformedReviews.length) return 0;
        return transformedReviews.reduce((acc, review) => acc + review.rating, 0) / transformedReviews.length;
    }, [transformedReviews]);

    // Filter reviews based on selected criteria
    const filteredReviews = useMemo(() => {
        if (!transformedReviews.length) return [];

        return transformedReviews.filter(review => {
            // Filter by rating if a specific rating is selected
            const ratingMatch = filterRating === 0 || review.rating === filterRating;

            // Filter by has-images if that option is selected
            const imageMatch = !showImageOnly || (review.images && review.images.length > 0);

            return ratingMatch && imageMatch;
        });
    }, [transformedReviews, filterRating, showImageOnly]);

    // Count reviews with images
    const reviewsWithImages = useMemo(() => {
        return transformedReviews.filter(review => review.images && review.images.length > 0).length;
    }, [transformedReviews]);

    // Count reviews by rating
    const ratingCounts = useMemo(() => {
        return [5, 4, 3, 2, 1].reduce((acc, rating) => {
            acc[rating] = transformedReviews.filter(review => review.rating === rating).length;
            return acc;
        }, {});
    }, [transformedReviews]);

    if (isLoading) {
        return (
            <div className="text-center py-6">
                <Spin tip="Đang tải dữ liệu đánh giá..." size="large">
                    <div style={{ height: "100px" }} />
                </Spin>
            </div>
        );
    }

    return (
        <div className="p-4 bg-white rounded-md mt-4">
            {/* Title */}
            <h4 className="text-2xl text-gray-800 mb-5">
                Đánh giá sản phẩm
            </h4>

            {/* User's reviews if exist - Collapsible section */}
            {userReviews && userReviews.length > 0 && (
                <div className="mb-6 border border-blue-100 rounded-md overflow-hidden">
                    {/* Collapsible header */}
                    <div
                        className="bg-blue-50 p-3 flex justify-between items-center cursor-pointer"
                        onClick={() => setShowUserReviews(!showUserReviews)}
                    >
                        <h5 className="text-lg font-medium m-0">Đánh giá của bạn ({userReviews.length})</h5>
                        <Button
                            type="text"
                            icon={showUserReviews ? <UpOutlined /> : <DownOutlined />}
                            className="flex items-center"
                        >
                            {showUserReviews ? "Ẩn đánh giá" : "Xem đánh giá"}
                        </Button>
                    </div>

                    {/* Collapsible content */}
                    {showUserReviews && (
                        <div className="p-4">
                            {userReviews.map(userReview => (
                                <div key={userReview.id} className="border-b border-gray-200 pb-4 mb-3 last:mb-0 last:pb-0 last:border-0">
                                    <div className="flex items-center mb-3">
                                        <Avatar
                                            icon={<UserOutlined />}
                                            size={40}
                                            className="flex-shrink-0"
                                        />
                                        <div className="ml-3">
                                            <div className="items-center">
                                                <Rate disabled value={userReview.rating} className="text-sm text-[#d0011b]" />
                                                <div className="text-xs text-gray-500 flex items-center flex-wrap">
                                                    <span>{formatRelativeTime(userReview.createdAt)}</span>
                                                    <span className="mx-1">|</span>
                                                    <span>{new Date(userReview.createdAt).toLocaleString('vi-VN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}</span>
                                                    <span className="mx-1">|</span>
                                                    <span className="text-gray-500 text-sm">
                                                        Phân loại hàng: {" "}
                                                        {userReview.category_name_1 && (`${userReview.category_name_1}: ${userReview.category_detail_name_1}`)}
                                                        {userReview.category_name_2 && (`, ${userReview.category_name_2}: ${userReview.category_detail_name_2}`)}
                                                    </span>
                                                    <span className="mx-1">|</span>
                                                    <span className="text-gray-500 text-sm">
                                                        Số lượng: {userReview.quantity}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ml-[3.2rem]">
                                        {userReview.buyerReview && (
                                            <p className="text-gray-700">{userReview.buyerReview}</p>
                                        )}

                                        {userReview.imageUrls && userReview.imageUrls.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                <Image.PreviewGroup>
                                                    {userReview.imageUrls.split(',').map((image, idx) => (
                                                        <Image
                                                            key={idx}
                                                            src={`${REVIEW_URL}${image}`}
                                                            alt={`Review ${idx + 1}`}
                                                            width={80}
                                                            height={80}
                                                            className="object-cover rounded border border-gray-300"
                                                        />
                                                    ))}
                                                </Image.PreviewGroup>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Reviews Section */}
            <div>

                {/* Rating Summary */}
                <div className="mt-3">
                    <div className="border border-gray-200 rounded-md p-3 bg-[#fffbf8] my-3">
                        <div className="flex items-center mb-6">
                            <div className="text-6xl text-[#d0011b] mr-6">
                                {averageRating.toFixed(1)}
                            </div>
                            <div>
                                <Rate allowHalf disabled value={averageRating} className="text-base text-[#d0011b]" />
                                <div className="mt-1 text-sm text-gray-500">
                                    {transformedReviews.length} đánh giá
                                </div>
                            </div>
                        </div>

                        {/* Filter options */}
                        <div className="">
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setFilterRating(0)}
                                    className={`px-3 py-1.5 rounded-full text-sm border ${filterRating === 0
                                        ? 'border-red-500 text-red-500 bg-red-50'
                                        : 'border-gray-300 text-gray-600'
                                        }`}
                                >
                                    Tất cả ({transformedReviews.length})
                                </button>

                                {[5, 4, 3, 2, 1].map(rating => (
                                    <button
                                        key={rating}
                                        onClick={() => setFilterRating(rating)}
                                        className={`px-3 py-1.5 rounded-full text-sm border flex items-center ${filterRating === rating
                                            ? 'border-red-500 text-red-500 bg-red-50'
                                            : 'border-gray-300 text-gray-600'
                                            }`}
                                    >
                                        <span>{rating} sao</span>
                                        <span className="ml-1">({ratingCounts[rating]})</span>
                                    </button>
                                ))}

                                <button
                                    onClick={() => setShowImageOnly(!showImageOnly)}
                                    className={`px-3 py-1.5 rounded-full text-sm border flex items-center ${showImageOnly
                                        ? 'border-red-500 text-red-500 bg-red-50'
                                        : 'border-gray-300 text-gray-600'
                                        }`}
                                >
                                    <PictureOutlined className="mr-1" />
                                    Có hình ảnh ({reviewsWithImages})
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Review List */}
                    <div className="space-y-4">
                        {filteredReviews.length > 0 ? (
                            filteredReviews.map(review => (
                                <div key={review.id} className="border-b border-gray-300 pb-4">
                                    <div className="flex items-center mb-3">
                                        <Avatar
                                            icon={<UserOutlined />}
                                            size={40}
                                            className="flex-shrink-0"
                                        />
                                        <div className="ml-3">
                                            <div className="items-center">
                                                <div className="font-medium text-sm">{review.user.fullName}</div>
                                                <Rate disabled value={review.rating} className="text-sm text-[#d0011b]" />
                                                <div className="text-xs text-gray-500 flex items-center">
                                                    <span>{formatRelativeTime(review.createdAt)}</span>
                                                    <span className="mx-1">•</span>
                                                    <span>{new Date(review.createdAt).toLocaleString('vi-VN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ml-[3.2rem]">
                                        <p className="text-gray-700">{review.comment}</p>

                                        {review.images && review.images.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                <Image.PreviewGroup>
                                                    {review.images.map((image, idx) => (
                                                        <Image
                                                            key={idx}
                                                            src={image}
                                                            alt={`Review ${idx + 1}`}
                                                            width={80}
                                                            height={80}
                                                            className="object-cover rounded border border-gray-300"
                                                        />
                                                    ))}
                                                </Image.PreviewGroup>
                                            </div>
                                        )}

                                        {review.shopAnswer && (
                                            <div className="mt-3 pl-4 border-l-2 border-gray-400 bg-gray-100 p-2 rounded">
                                                <div className="text-sm font-medium">Phản hồi của người bán:</div>
                                                <p className="text-gray-600 text-sm">{review.shopAnswer}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <Empty description="Không có đánh giá nào phù hợp với bộ lọc." />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPreview;
