import { List } from 'antd';
import CartItem from './CartItem';

const CartList = ({ cartItems, selectedItems, onRemove, onUpdateQuantity, onToggleSelect }) => {
    return (
        <div className="max-h-72 overflow-y-auto">

            <List
                dataSource={cartItems}
                renderItem={item => (
                    <CartItem
                        key={item.id}
                        item={item}
                        onRemove={onRemove}
                        onUpdateQuantity={onUpdateQuantity}
                        onToggleSelect={onToggleSelect}
                        selectedItems={selectedItems}
                    />
                )}
                locale={{
                    emptyText: "Giỏ hàng của bạn hiện đang trống!",
                }}
            />
        </div>
    );
};

export default CartList;
