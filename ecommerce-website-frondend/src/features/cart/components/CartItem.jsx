import { List, InputNumber, Checkbox, Button } from 'antd';
import { DeleteOutlined, HighlightOutlined, VideoCameraAddOutlined } from '@ant-design/icons';
import { TOOL_URL } from "../../../utils/Config"
const CartItem = ({ item, onRemove, onUpdateQuantity, onToggleSelect, selectedItems }) => {
    return (
        <List.Item
            className="border rounded-lg mb-2 py-2 px-2 bg-green-50" // Giảm padding và margin giữa các item
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
                    <div className="flex items-center space-x-2 w-4/5">
                        {item.type === "product" ? (
                            <HighlightOutlined className="text-green-500 text-sm flex-none" />
                        ) : (
                            <VideoCameraAddOutlined className="text-green-500 text-sm flex-none" />
                        )}
                        <span
                            className="text-sm font-semibold text-base overflow-hidden line-clamp-1 w-full text-two-lines"
                        >
                            {item.name}
                        </span>
                    </div>
                }
                description={(
                    <div className="text-sm">
                        {item.discountPrice !== 0 ? (
                            <>
                                <p className="line-through text-gray-500">{item.price.toLocaleString()} VND</p>
                                <p className="text-red-500 font-medium">{item.discountPrice.toLocaleString()} VND</p>
                            </>
                        ) : (
                            <p className="text-red-500 font-medium">{item.price.toLocaleString()} VND</p>
                        )}
                    </div>
                )}
            />

            <div className="text-right font-semibold text-sm">
                {((item.discountPrice || item.price) * item.quantity).toLocaleString()} VND
            </div>
        </List.Item>
    );
};

export default CartItem;
