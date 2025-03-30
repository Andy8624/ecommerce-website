import { List, InputNumber, Checkbox, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { TOOL_URL } from "../../../utils/Config"
import { useQuery } from '@tanstack/react-query';
import { callGetVariantDetailById } from '../../../services/VariantDetailService';
const CartItem = ({ item, onRemove, onUpdateQuantity, onToggleSelect, selectedItems }) => {
    console.log(item);
    const { isLoading: isLoadingVariantDetail1, data: variantDetail1 } = useQuery({
        queryKey: ['variantDetail', item?.variantDetailId1],
        queryFn: () => callGetVariantDetailById(item?.variantDetailId1),
        enabled: !!item?.variantDetailId1,
        staleTime: 60 * 10 * 1000, // 10p
    })

    const { isLoading: isLoadingVariantDetail2, data: variantDetail2 } = useQuery({
        queryKey: ['variantDetail', item?.variantDetailId2],
        queryFn: () => callGetVariantDetailById(item?.variantDetailId2),
        enabled: !!item?.variantDetailId2,
        staleTime: 60 * 10 * 1000, // 10p
    })

    const price = variantDetail1?.price || item.price;

    return (
        <List.Item
            className="border rounded-lg mb-2 py-2 px-2 bg-gray-50" // Giảm padding và margin giữa các item
            actions={[
                <div key={item.id} className="flex items-center space-x-2">
                    {item.type === 'product' && (
                        <InputNumber
                            min={1}
                            value={item.quantity}
                            onChange={(value) => onUpdateQuantity(item.id, value)}
                            size="small"
                        />
                    )}
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => onRemove(item.id)}
                        type="danger"
                        size="small"
                    />
                </div>
            ]}
        >
            <List.Item.Meta
                // className="mr-[3rem]"
                avatar={
                    <div className="flex items-center space-x-3 mx-2">
                        <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onChange={() => onToggleSelect(item.id)}
                        />
                        <img src={TOOL_URL + item.image} alt={item.name} className="w-16 h-16 object-cover rounded" /> {/* Giảm kích thước hình ảnh */}
                    </div>
                }
                title={
                    <div className="w-64">
                        <span
                            className="text-sm text-base overflow-hidden line-clamp-1 w-full text-two-lines"
                            title={item.name}
                        >
                            {item.name}
                        </span>
                    </div>
                }
                description={(
                    <div className="text-sm min-w-full">
                        {/* {item.discountPrice !== 0 ? (
                            <>
                                <p className="line-through text-gray-500">₫{item.price.toLocaleString()}</p>
                                <p className="text-red-500 font-medium">₫{item.discountPrice.toLocaleString()}</p>
                            </>
                        ) : (
                            <p className="text-red-500 font-medium">₫{item.price.toLocaleString()}</p>
                        )} */}
                        <p className="text-red-500 font-medium">₫{price?.toLocaleString()}</p>

                    </div>
                )}
            />
            <div className="mr-[100px] capitalize min-w-32">
                {isLoadingVariantDetail1 || isLoadingVariantDetail2 ? (
                    <span className="text-gray-500">Đang tải...</span>
                ) : (
                    <>
                        {variantDetail1?.category_name && variantDetail1?.category_detail_name && (

                            <span className="font-medium text-gray-500 text-sm">
                                {variantDetail1.category_name}: {" "}
                                {variantDetail1.category_detail_name}
                            </span>

                        )}
                        {variantDetail2?.category_name && variantDetail2?.category_detail_name && (
                            <span className="font-medium text-gray-500 text-sm">
                                <br />
                                {variantDetail2.category_name}: {" "}
                                {variantDetail2.category_detail_name}
                            </span>

                        )}
                    </>
                )}
            </div>

            <div className="text-sm text-red-500">
                {/* ₫{((item.discountPrice || item.price) * item.quantity).toLocaleString()} */}
                ₫{((price) * item.quantity).toLocaleString()}
            </div>
        </List.Item >
    );
};

export default CartItem;
