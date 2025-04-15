import { List, Checkbox } from 'antd';
import CartItem from './CartItem';
import { Link } from 'react-router-dom';

const CartList = ({
    cartItems,
    selectedItems,
    onRemove,
    onUpdateQuantity,
    onToggleSelect,
    onToggleSelectAll,
    onToggleSelectShop
}) => {
    // Nhóm sản phẩm theo ownerUser.userId
    const groupedItems = cartItems.reduce((acc, item) => {
        const userId = item.ownerUser.userId;
        if (!acc[userId]) {
            acc[userId] = {
                user: item.ownerUser,
                items: [],
                latestCreatedAt: new Date(item.createdAt).getTime(),
            };
        }
        acc[userId].items.push(item);

        // Cập nhật latestCreatedAt nếu sản phẩm này mới hơn
        const itemCreatedAt = new Date(item.createdAt).getTime();
        if (itemCreatedAt > acc[userId].latestCreatedAt) {
            acc[userId].latestCreatedAt = itemCreatedAt;
        }

        return acc;
    }, {});

    // Chuyển thành mảng và sắp xếp nhóm theo latestCreatedAt (mới nhất lên đầu)
    const sortedGroups = Object.values(groupedItems)
        .map((group) => ({
            ...group,
            items: group.items.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            ),
        }))
        .sort((a, b) => b.latestCreatedAt - a.latestCreatedAt);

    // Check if all items are selected (with proper null check)
    const areAllItemsSelected = cartItems.length > 0 && selectedItems && cartItems.every(item =>
        selectedItems.includes(item.id)
    );

    // Check if all items of a specific shop are selected (with proper null check)
    const isShopSelected = (shopItems) => {
        return shopItems.length > 0 && selectedItems && shopItems.every(item =>
            selectedItems.includes(item.id)
        );
    };

    if (sortedGroups.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-80 p-8 rounded-lg shadow-md border border-gray-300 bg-white text-center">
                <div className="text-xl font-semibold mb-4">Giỏ hàng của bạn hiện đang trống!</div>
                <p className="text-gray-600 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm.</p>
                <Link to="/" className="bg-blue-500 hover:bg-white transition border border-blue-500 border-blue-500 hover:text-blue-500 text-white font-bold py-2 px-4 rounded">
                    Khám Phá Ngay
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Select All Checkbox at the top */}
            <div className="p-4 rounded-lg shadow-md border border-gray-300 bg-white mb-4">
                <Checkbox
                    checked={areAllItemsSelected}
                    onChange={() => onToggleSelectAll(!areAllItemsSelected)}
                    className="font-semibold"
                >
                    Chọn Tất Cả ({cartItems.length} sản phẩm)
                </Checkbox>
            </div>

            {sortedGroups.map((group, index) => (
                <div
                    key={group.user.userId}
                    className={`p-4 rounded-lg shadow-md border border-gray-300 bg-white ${index > 0 ? 'mt-4' : ''}`}
                >
                    {/* Tiêu đề nhóm theo seller với checkbox chọn tất cả của shop */}
                    <div className="flex items-center justify-between mb-4 border-b pb-2">
                        <div className="flex items-center">
                            <Checkbox
                                checked={isShopSelected(group.items)}
                                onChange={() => onToggleSelectShop(group.user.userId, !isShopSelected(group.items))}
                                className="mr-2"
                            />
                            <h2 className="text-lg font-bold text-gray-800 m-0">
                                🛍️ {group.user.shopName}
                            </h2>
                        </div>
                    </div>
                    <List
                        dataSource={group.items}
                        renderItem={(item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onRemove={onRemove}
                                onUpdateQuantity={onUpdateQuantity}
                                onToggleSelect={onToggleSelect}
                                // isSelected={selectedItems?.includes(item.id) || false}
                                selectedItems={selectedItems || []}
                            />
                        )}
                        locale={{
                            emptyText: '',
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

export default CartList;