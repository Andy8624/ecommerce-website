import { CommentOutlined } from '@ant-design/icons';
import { TOOL_URL } from '../../../utils/Config';

const OrderProductList = ({ groupedCheckoutProducts }) => {
    return (
        <div>
            {Object.values(groupedCheckoutProducts)?.map(({ seller, products, totalSellerAmount, shippingCost }) => (
                <div key={seller.userId} className="shadow-xl mt-3 border rounded-lg shadow-sm bg-white">
                    <p className="text-base px-5 py-3">
                        🛍️ <span className="cursor-pointer hover:text-gray-500 transition">
                            {seller?.fullName}
                        </span>
                        {" "} | <span className="text-gray-500 cursor-pointer text-[#00bfa5]"><CommentOutlined /> Trò chuyện</span>
                    </p>
                    <hr />
                    {products?.map((item) => {
                        const price = item?.price;
                        const total = price * item?.quantity;

                        return (
                            <div key={item?.id} className="flex items-center px-5 py-3 space-x-4 p-2 border-b justify-between">
                                <div className="flex items-center">
                                    <img src={TOOL_URL + item?.image} alt={item?.name} className="w-16 h-16 object-cover rounded" />
                                    <div className="w-80 ms-5">
                                        <span
                                            className="text-sm text-base overflow-hidden line-clamp-1 w-full text-two-lines"
                                            title={item?.name}
                                        >
                                            {item?.name}
                                        </span>
                                    </div>
                                </div>

                                {/* Loại sản phẩm */}
                                <div className="w-32 text-gray-500">
                                    {item?.variantDetail1 && item?.variantDetail1.category_name && item?.variantDetail1.category_detail_name && (
                                        <p>{item?.variantDetail1.category_name}: {item?.variantDetail1.category_detail_name}</p>
                                    )}
                                    {item?.variantDetail2 && item?.variantDetail2.category_name && item?.variantDetail2.category_detail_name && (
                                        <p>{item?.variantDetail2.category_name}: {item?.variantDetail2.category_detail_name}</p>
                                    )}
                                </div>

                                {/* Giá */}
                                <div className="w-32 text-gray-600">
                                    ₫{price?.toLocaleString()}
                                </div>

                                {/* Số lượng */}
                                <div className="w-20 text-gray-500">
                                    {item?.quantity}
                                </div>

                                {/* Thành tiền */}
                                <div className="w-32 text-gray-600 text-right pr-5">
                                    ₫{total?.toLocaleString()}
                                </div>
                            </div>
                        );
                    })}

                    <div className="flex justify-end mx-5">
                        <div className="p-4 mt-4 w-80">
                            <div className="flex justify-between">
                                <p className="text-gray-600">Phí vận chuyển:</p>
                                <p className="text-gray-600">₫{shippingCost?.toLocaleString()}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-gray-600">Tổng tiền: ({products?.length} sản phẩm):</p>
                                <p className="text-gray-500">₫{totalSellerAmount?.toLocaleString()}</p>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between">
                                <p className="text-gray-600">Tổng cộng:</p>
                                <p className="text-blue-500">₫{(totalSellerAmount + shippingCost)?.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default OrderProductList