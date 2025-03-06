import CartList from './CartList';
import CartSummary from './CartSummary';
import { useUpdateCartItem } from '../hooks/useUpdateCartItem';
import useDeleteCartTool from '../hooks/useDeleteCartTool';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../../../hooks/useCartContext';

const CartComponent = () => {
    const navigate = useNavigate();
    const {
        cartItems, setCartItems,
        cartQuantity, setCartQuantity,
        selectedItems, setSelectedItems
    } = useCartContext();

    const { updateCartItem } = useUpdateCartItem();
    const updateQuantity = (id, quantity) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity } : item
        ));
        updateCartItem({
            data: { quantity },
            cartToolId: id
        });
    };

    const { deleteCartTool } = useDeleteCartTool();
    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
        setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        deleteCartTool(id);
        setCartQuantity(cartQuantity - 1);
    };

    const toggleSelectItem = (id) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
    };

    const getTotal = () => {
        return cartItems.reduce(
            (total, item) =>
                selectedItems.includes(item.id) ? total + (item.discountPrice || item.price) * item.quantity : total
            , 0
        );
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };



    return (
        <div className="bg-gray-200 flex justify-center">
            <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-lg my-[20px]">
                <h2 className="text-2xl font-bold mb-3 text-center">
                    <div className="mb-1">Giỏ hàng của bạn</div>
                </h2>
                <CartList
                    cartItems={cartItems}
                    selectedItems={selectedItems}
                    onRemove={removeItem}
                    onUpdateQuantity={updateQuantity}
                    onToggleSelect={toggleSelectItem}
                />
                {cartQuantity === 0 ||
                    <CartSummary
                        total={getTotal()}
                        onCheckout={handleCheckout}
                        isDisabled={selectedItems.length === 0}
                    />
                }
            </div>
        </div>
    );
};

export default CartComponent;
