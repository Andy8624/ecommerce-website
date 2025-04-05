import { Rate, Avatar } from "antd";
import { UserOutlined, PictureOutlined } from "@ant-design/icons";
import { useState } from "react";


// Mock data for product reviews
const mockReviews = [
    {
        id: 1,
        user: {
            fullName: "Nguyễn Văn A",
            imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
            verified: true
        },
        rating: 5,
        comment: "Sản phẩm rất tốt, chất lượng cao, đóng gói cẩn thận. Tôi rất hài lòng với trải nghiệm mua hàng này.",
        createdAt: "2025-04-01T10:23:45.000Z",
        images: [
            "https://picsum.photos/id/26/300/300",
            "https://picsum.photos/id/96/300/300"
        ]
    },
    {
        id: 2,
        user: {
            fullName: "Trần Thị B",
            imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
            verified: true
        },
        rating: 4,
        comment: "Giao hàng nhanh, sản phẩm đúng mô tả. Tuy nhiên, bao bì hơi bị móp một chút.",
        createdAt: "2025-03-28T08:14:22.000Z",
        images: []
    },
    {
        id: 3,
        user: {
            fullName: "Phạm Văn C",
            imageUrl: "https://randomuser.me/api/portraits/men/67.jpg",
            verified: false
        },
        rating: 3,
        comment: "Sản phẩm tạm ổn, không tốt lắm nhưng cũng không tệ. Giá cả phải chăng.",
        createdAt: "2025-03-25T15:41:33.000Z",
        images: [
            "https://picsum.photos/id/65/300/300"
        ]
    },
    {
        id: 4,
        user: {
            fullName: "Lê Thị D",
            imageUrl: "https://randomuser.me/api/portraits/women/22.jpg",
            verified: true
        },
        rating: 5,
        comment: "Tuyệt vời! Sản phẩm chất lượng cao, giao hàng nhanh. Tôi sẽ tiếp tục mua hàng ở đây.",
        createdAt: "2025-03-20T11:35:18.000Z",
        images: [
            "https://picsum.photos/id/42/300/300",
            "https://picsum.photos/id/43/300/300",
            "https://picsum.photos/id/45/300/300"
        ]
    },
    {
        id: 5,
        user: {
            fullName: "Hoàng Văn E",
            imageUrl: "",
            verified: false
        },
        rating: 2,
        comment: "Sản phẩm không đúng với mô tả, chất liệu kém hơn tôi nghĩ. Hơi thất vọng.",
        createdAt: "2025-03-18T09:22:51.000Z",
        images: []
    }
];

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

const ProductPreview = () => {
    const [filterRating, setFilterRating] = useState(0); // 0 = all ratings
    const [showImageOnly, setShowImageOnly] = useState(false);

    // Calculate average rating
    const averageRating = mockReviews.length > 0
        ? mockReviews.reduce((acc, review) => acc + review.rating, 0) / mockReviews.length
        : 0;

    // Filter reviews based on selected criteria
    const filteredReviews = mockReviews.filter(review => {
        // Filter by rating if a specific rating is selected
        const ratingMatch = filterRating === 0 || review.rating === filterRating;

        // Filter by has-images if that option is selected
        const imageMatch = !showImageOnly || (review.images && review.images.length > 0);

        return ratingMatch && imageMatch;
    });

    // Count reviews with images
    const reviewsWithImages = mockReviews.filter(review => review.images && review.images.length > 0).length;

    // Count reviews by rating
    const ratingCounts = [5, 4, 3, 2, 1].reduce((acc, rating) => {
        acc[rating] = mockReviews.filter(review => review.rating === rating).length;
        return acc;
    }, {});

    return (
        <div className="p-4 bg-white rounded-md mt-4">
            {/* Reviews Section */}
            <div>
                {/* Title */}
                <h4 className="text-2xl text-gray-800 mb-5">
                    Đánh giá sản phẩm
                </h4>

                {/* Rating Summary */}
                <div className="mt-3">
                    <div className="border border-gray-200 rounded-md p-3 bg-[#fffbf8] my-3">
                        <div className="flex items-center mb-6">
                            <div className="text-6xl text-[#d0011b] mr-6">
                                {averageRating.toFixed(1)}
                            </div>
                            <div>
                                <Rate allowHalf disabled defaultValue={averageRating} className="text-base text-[#d0011b]" />
                                <div className="mt-1 text-sm text-gray-500">
                                    {mockReviews.length} đánh giá
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
                                    Tất cả ({mockReviews.length})
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
                                        {/* <StarFilled className="ml-1 text-[#d0011b]" /> */}
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
                                            src={review.user.imageUrl}
                                            icon={!review.user.imageUrl && <UserOutlined />}
                                            size={40}
                                            className="flex-shrink-0"
                                        />
                                        <div className="ml-3">
                                            <div className=" items-center">
                                                <Rate disabled defaultValue={review.rating} className="text-sm text-[#d0011b]" />
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

                                    <div>
                                        <p className="text-gray-700">{review.comment}</p>

                                        {review.images && review.images.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {review.images.map((image, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={image}
                                                        alt={`Review ${idx + 1}`}
                                                        className="w-20 h-20 object-cover rounded"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-gray-500">Không có đánh giá nào phù hợp với bộ lọc.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPreview;
