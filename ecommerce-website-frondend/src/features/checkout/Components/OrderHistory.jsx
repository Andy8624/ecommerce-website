import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useGetOrderByUserId } from '../hooks/orders/useGetOrderByUserId';
import { useUpdateOrderStatus } from '../../seller/hooks/useUpdateOrderStatus';
import { Badge, Card, Collapse, List, Image, Descriptions, Spin, Empty, Button, Space, Modal, Rate, Input, Form, message, Upload } from 'antd';
import { ShoppingOutlined, StarOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { TOOL_URL } from '../../../utils/Config';
import { useQueryClient } from '@tanstack/react-query';
import { uploadMultipleFiles } from "../../../services/FileService";

const { TextArea } = Input;

const formatVietnamDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Ho_Chi_Minh'
    });
};

const getStatusColor = (status) => {
    switch (status) {
        case 'PENDING':
            return 'yellow';
        case 'CONFIRMED':
            return 'cyan';
        case 'SHIPPING':
            return 'purple';
        case 'COMPLETED':
            return 'green';
        case 'CANCELLED':
            return 'red';
        default:
            return 'default';
    }
};

const OrderHistory = () => {
    const userId = useSelector(state => state?.account?.user?.id);
    const { orders, isLoading } = useGetOrderByUserId(userId);
    const { updateOrderStatus, updateOrderRatedStatus } = useUpdateOrderStatus();

    // State for review modal
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [reviewForm] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [fileList, setFileList] = useState({});
    const [uploadingImages, setUploadingImages] = useState({});
    const queryClient = useQueryClient();

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await updateOrderStatus({ orderId, status: newStatus });
            message.success(`Trạng thái đơn hàng đã được cập nhật thành ${newStatus}`);
            queryClient.invalidateQueries(["orders"]);
        } catch (error) {
            console.error("Error updating order status:", error);
            message.error("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
        }
    };

    // Open review modal
    const openReviewModal = (order) => {
        setSelectedOrder(order);
        setIsReviewModalOpen(true);

        // Initialize empty file lists for each product
        const initialFileList = {};
        order.orderTools.forEach(item => {
            initialFileList[item.orderToolId] = [];
        });
        setFileList(initialFileList);
        setUploadingImages({});

        // Reset form when opening modal
        reviewForm.resetFields();
    };

    // Handle file upload state changes - similar to ProductForm
    const handleUploadChange = (info, orderToolId) => {
        // Update the fileList for the specific product
        const newFileList = { ...fileList };
        newFileList[orderToolId] = info.fileList;
        setFileList(newFileList);

        // Update loading state
        if (info.file.status === 'uploading') {
            setUploadingImages(prev => ({ ...prev, [orderToolId]: true }));
        } else {
            setUploadingImages(prev => ({ ...prev, [orderToolId]: false }));
        }
    };

    // Custom request function that skips actual upload during form editing
    const customUploadRequest = ({ file, onSuccess }) => {
        // Just mark as success without actual upload
        setTimeout(() => {
            onSuccess("ok");
        }, 500);
    };

    // Function to handle the actual file upload when submitting
    const handleFileUpload = async (files, toolId) => {
        if (!files || files.length === 0) return [];

        try {
            // Extract originFileObj from file list entries
            const filesToUpload = files.map(file => file.originFileObj);
            // Use the existing uploadMultipleFiles function from your FileService
            // Pass toolId instead of folderId as per the function signature
            const uploadedFileNames = await uploadMultipleFiles(filesToUpload, "reviews", toolId, false);
            console.log("Uploaded file names:", uploadedFileNames);
            return uploadedFileNames;
        } catch (error) {
            console.error("Error uploading files:", error);
            message.error("Có lỗi khi tải lên hình ảnh");
            return [];
        }
    };

    // Submit review with image handling
    const handleReviewSubmit = async () => {
        try {
            setSubmitting(true);
            const values = await reviewForm.validateFields();

            if (!selectedOrder) {
                message.error("Không có đơn hàng được chọn");
                return;
            }

            // Collect all reviews
            const reviewPromises = [];
            const orderId = selectedOrder.orderId;

            // Process each product review
            for (const [orderToolId, rating] of Object.entries(values.productRatings || {})) {
                // Get the toolId from the order tool
                const toolId = selectedOrder.orderTools.find(item =>
                    item.orderToolId === orderToolId
                )?.tool?.toolId;

                if (!toolId) {
                    console.error(`Tool ID not found for orderToolId: ${orderToolId}`);
                    continue;
                }

                // First upload all images for this product review using toolId
                const productFiles = fileList[orderToolId] || [];
                const uploadedImageUrls = await handleFileUpload(productFiles, toolId);

                const reviewData = {
                    orderToolId,
                    toolId,
                    rating: rating.rating,
                    comment: rating.comment || "",
                    imageUrls: uploadedImageUrls
                };

                // Here you would push an API call to save the review
                // reviewPromises.push(saveProductReview(reviewData));
                reviewPromises.push(
                    new Promise(resolve => {
                        // Simulate API call
                        setTimeout(() => {
                            console.log("Saving review:", reviewData);
                            resolve(reviewData);
                        }, 300);
                    })
                );
            }

            // Wait for all review submissions to complete
            await Promise.all(reviewPromises);

            // Update the order's rated status
            // await updateOrderRatedStatus(orderId, true);
            // Simulate updating order rated status
            console.log("Marking order as rated:", orderId);
            await new Promise(resolve => setTimeout(resolve, 500));

            message.success("Đánh giá sản phẩm thành công!");
            setIsReviewModalOpen(false);

            // Refresh order list to show updated rated status
            queryClient.invalidateQueries(["orders"]);
        } catch (error) {
            console.error("Error submitting review:", error);
            message.error("Có lỗi xảy ra khi gửi đánh giá");
        } finally {
            setSubmitting(false);
        }
    };

    const renderOrderProducts = (order) => (
        <List
            className="mt-4"
            dataSource={order.orderTools}
            renderItem={(item) => (
                <List.Item>
                    <div className="flex items-center w-full">
                        <Image
                            src={`${TOOL_URL}${item.tool.imageUrl}`}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="object-cover rounded-md"
                        />
                        <div className="ml-4 flex-grow">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-gray-500">
                                {item.category_name_1 && `${item.category_name_1}: ${item.category_detail_name_1}`}
                                {item.category_name_2 && `, ${item.category_name_2}: ${item.category_detail_name_2}`}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-red-500 font-medium">
                                    {item.price.toLocaleString()}đ
                                </span>
                                <span>x{item.quantity}</span>
                            </div>
                        </div>
                    </div>
                </List.Item>
            )}
        />
    );

    // Render review form inside modal
    const renderReviewForm = () => {
        if (!selectedOrder) return null;

        return (
            <Form form={reviewForm} layout="vertical">
                {selectedOrder.orderTools.map((item) => (
                    <div key={item.orderToolId} className="border-b border-gray-300 pb-4 mb-4">
                        <div className="flex items-center mb-3">
                            <Image
                                src={`${TOOL_URL}${item.tool.imageUrl}`}
                                alt={item.name}
                                width={60}
                                height={60}
                                className="object-cover rounded-md"
                            />
                            <div className="ml-3">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                    {item.category_name_1 && `${item.category_name_1}: ${item.category_detail_name_1}`}
                                    {item.category_name_2 && `, ${item.category_name_2}: ${item.category_detail_name_2}`}
                                </p>
                            </div>
                        </div>

                        <Form.Item
                            name={['productRatings', item.orderToolId, 'rating']}
                            label="Đánh giá sao"
                            rules={[{ required: true, message: 'Vui lòng chọn số sao!' }]}
                        >
                            <Rate className='text-[#d0011b]' />
                        </Form.Item>

                        <Form.Item
                            name={['productRatings', item.orderToolId, 'comment']}
                            label="Nhận xét"
                        >
                            <TextArea
                                rows={3}
                                placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                                maxLength={500}
                                showCount
                            />
                        </Form.Item>

                        {/* Upload multiple images - using similar pattern to ProductForm */}
                        <Form.Item
                            label="Hình ảnh đánh giá (tối đa 5 hình)"
                        >
                            <Upload
                                listType="picture-card"
                                fileList={fileList[item.orderToolId] || []}
                                onChange={(info) => handleUploadChange(info, item.orderToolId)}
                                customRequest={customUploadRequest}
                                maxCount={5}
                                multiple
                                accept=".png,.jpg,.jpeg"
                                beforeUpload={(file) => {
                                    // Validate file type and size
                                    const isImage = file.type.startsWith('image/');
                                    if (!isImage) {
                                        message.error('Chỉ được tải lên file hình ảnh!');
                                        return Upload.LIST_IGNORE;
                                    }
                                    const isLt2M = file.size / 1024 / 1024 < 2;
                                    if (!isLt2M) {
                                        message.error('Hình ảnh phải nhỏ hơn 2MB!');
                                        return Upload.LIST_IGNORE;
                                    }
                                    return true;
                                }}
                            >
                                {(fileList[item.orderToolId]?.length >= 5) ? null : (
                                    <div>
                                        {uploadingImages[item.orderToolId] ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Tải lên</div>
                                    </div>
                                )}
                            </Upload>
                            <p className="text-xs text-gray-500 mt-1">
                                Chia sẻ hình ảnh thực tế của sản phẩm giúp người mua hàng tham khảo tốt hơn
                            </p>
                        </Form.Item>
                    </div>
                ))}
            </Form>
        );
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><Spin size="large" /></div>;
    }

    if (!orders?.length) {
        return <Empty className='py-[180px]' description="Bạn chưa có đơn hàng nào" />;
    }

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-4">
            <h2 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h2>
            <List
                dataSource={orders}
                renderItem={(order) => (
                    <Card key={order.orderId} className="mb-4 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <span className="text-gray-500">Mã đơn hàng: </span>
                                <span className="font-medium">{order.orderId}</span>
                            </div>
                            <Badge color={getStatusColor(order.status)} text={order.status} />
                        </div>

                        <Descriptions bordered size="small" column={2} className="mb-4">
                            <Descriptions.Item label="Cửa hàng">
                                {order?.orderTools[0]?.tool?.user?.fullName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày đặt"
                                className="w-[200px]">
                                {formatVietnamDate(order.createdAt)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ giao hàng">
                                {`${order.address.street}, ${order.address.ward}, ${order.address.district}, ${order.address.city}`}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phương thức thanh toán"
                                className="w-[200px]">
                                {order.paymentMethod.name}
                            </Descriptions.Item>
                        </Descriptions>

                        <Collapse
                            className="bg-white border-gray-200"
                            items={[{
                                key: '1',
                                label: (
                                    <div className="flex items-center space-x-2">
                                        <ShoppingOutlined />
                                        <span>{`Danh sách sản phẩm (${order.orderTools.length})`}</span>
                                    </div>
                                ),
                                children: renderOrderProducts(order),
                            }]}
                        />

                        <div className="mt-4 flex justify-between items-center">
                            <Space>
                                {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                                    <Button
                                        danger
                                        onClick={() => handleUpdateStatus(order.orderId, 'CANCELLED')}
                                    >
                                        Hủy đơn hàng
                                    </Button>
                                )}
                                {order.status === 'SHIPPING' && (
                                    <Button
                                        type="primary"
                                        onClick={() => handleUpdateStatus(order.orderId, 'COMPLETED')}
                                        className="bg-blue-500 hover:bg-blue-600"
                                    >
                                        Đã nhận được hàng
                                    </Button>
                                )}
                                {order.status === 'COMPLETED' && !order.rated && (
                                    <Button
                                        type="primary"
                                        className='bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white transition duration-300'
                                        icon={<StarOutlined />}
                                        onClick={() => openReviewModal(order)}
                                    >
                                        Đánh giá sản phẩm
                                    </Button>
                                )}
                            </Space>

                            <div className="text-right">
                                <span className="text-gray-500 mr-2">Phí vận chuyển:</span>
                                <span className="font-medium">{order.shippingCost.toLocaleString()}đ</span>
                                <span className="text-gray-500 mx-2">|</span>
                                <span className="text-gray-500 mr-2">Tổng tiền:</span>
                                <span className="text-xl font-bold text-red-500">
                                    {(order.orderTools.reduce((total, item) => total + (item.price * item.quantity), 0) + order.shippingCost).toLocaleString()}đ
                                </span>
                            </div>
                        </div>
                    </Card>
                )}
            />

            <Modal
                title={
                    <div className="flex items-center">
                        <span className='text-xl'>Đánh giá sản phẩm</span>
                    </div>
                }
                open={isReviewModalOpen}
                onCancel={() => setIsReviewModalOpen(false)}
                width={700}
                footer={[
                    <Button key="back" onClick={() => setIsReviewModalOpen(false)}>
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={submitting}
                        onClick={handleReviewSubmit}
                        className="bg-blue-500 hover:bg-blue-600"
                    >
                        Gửi đánh giá
                    </Button>,
                ]}
            >
                {renderReviewForm()}
            </Modal>
        </div>
    );
};

export default OrderHistory;
