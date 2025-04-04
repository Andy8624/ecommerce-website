import { List } from 'antd';
import CartItem from './CartItem';
import { Link } from 'react-router-dom';

const CartList = ({
    cartItems,
    selectedItems,
    onRemove,
    onUpdateQuantity,
    onToggleSelect,
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
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // 🔥 Sắp xếp sản phẩm theo createdAt
            ),
        }))
        .sort((a, b) => b.latestCreatedAt - a.latestCreatedAt); // 🔥 Sắp xếp nhóm theo sản phẩm mới nhất (createdAt)

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
            {sortedGroups.map((group, index) => (
                <div
                    key={group.user.userId}
                    className={`p-4 rounded-lg shadow-md border border-gray-300 bg-white ${index > 0 ? 'mt-1' : ''
                        }`}
                >
                    {/* Tiêu đề nhóm theo seller */}
                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                        🛍️ {group.user.fullName}
                    </h2>
                    <List
                        dataSource={group.items}
                        renderItem={(item) => (
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
                            emptyText: '',
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

export default CartList;